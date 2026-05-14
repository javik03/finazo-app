/**
 * One-off backfill: assign unique featured images to articles that
 * currently share the same Pexels photo.
 *
 * Root cause: src/lib/pexels.ts queries Pexels with per_page=1 and
 * returns the top result. When multiple article generators ran with
 * similar imageQuery values (e.g. 10 "alternativa-a-<carrier>"
 * articles all queried "auto insurance"), they all received the same
 * top photo, breaking the visual hub layout.
 *
 * This script:
 *   1. Loads every US-published article + its current featured image.
 *   2. Groups by image URL — identifies duplicates.
 *   3. For each duplicate cluster, keeps the first article on its
 *      current image and re-fetches a fresh, unique image for the
 *      rest using a slug+category-derived query and an exclusion list
 *      of every image already used elsewhere on the site.
 *   4. Updates each rewritten article's featured_image_url + IndexNow
 *      ping so search engines pick up the change.
 *
 * Dry-run by default. Pass --apply to commit changes.
 *
 * Entry points:
 *   npx tsx src/agents/writer/refresh-duplicate-images.ts          # dry-run
 *   npx tsx src/agents/writer/refresh-duplicate-images.ts --apply  # commit
 */

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { config } from "@/lib/config";
import { notifyIndexNow } from "@/lib/indexnow";
import { buildVariedImageQuery } from "@/lib/image-queries";
import pino from "pino";

const logger = pino({ name: "refresh-duplicate-images" });

interface PexelsPhoto {
  id: number;
  src: { landscape: string; large2x: string; large: string };
  alt: string;
}
interface PexelsResponse {
  photos: PexelsPhoto[];
}

// The "build query" helper now lives in src/lib/image-queries.ts as
// buildVariedImageQuery — themed conceptual variations rather than
// generic "hispanic family" tokens which Pexels returns visually
// similar results for.

function photoIdFromUrl(url: string | null): number | null {
  if (!url) return null;
  const m = url.match(/pexels-photo-(\d+)/);
  return m ? Number(m[1]) : null;
}

async function fetchCandidates(
  query: string,
  exclude: Set<number>,
): Promise<PexelsPhoto | null> {
  if (!config.PEXELS_API_KEY) {
    logger.error("PEXELS_API_KEY not set — cannot refresh images");
    return null;
  }
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: config.PEXELS_API_KEY },
  });
  if (!res.ok) {
    logger.warn({ status: res.status, query }, "Pexels API non-OK");
    return null;
  }
  const data = (await res.json()) as PexelsResponse;
  for (const photo of data.photos) {
    if (!exclude.has(photo.id)) return photo;
  }
  // All 30 candidates already used elsewhere. Caller decides whether to
  // fall back to a broader query or leave the duplicate.
  return null;
}

type Row = {
  slug: string;
  category: string;
  featuredImageUrl: string | null;
};

async function loadRows(): Promise<Row[]> {
  const rows = await db
    .select({
      slug: articles.slug,
      category: articles.category,
      featuredImageUrl: articles.featuredImageUrl,
    })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        eq(articles.status, "published"),
        isNotNull(articles.featuredImageUrl),
      ),
    );
  return rows;
}

async function applyUpdate(
  slug: string,
  newUrl: string,
): Promise<void> {
  await db
    .update(articles)
    .set({
      featuredImageUrl: newUrl,
      updatedAt: sql`NOW()`,
    })
    .where(eq(articles.slug, slug));
  await notifyIndexNow([`https://finazo.us/guias/${slug}`]).catch(() => {});
}

type RunOptions = { apply?: boolean; refreshAll?: boolean };

export async function run(options: RunOptions = {}): Promise<void> {
  const apply = options.apply ?? false;
  const refreshAll = options.refreshAll ?? false;
  const rows = await loadRows();
  logger.info(
    { total: rows.length, mode: apply ? "APPLY" : "DRY-RUN", refreshAll },
    "Loaded",
  );

  // Build the running "used" set seeded with every current ID. Each
  // successful reassignment adds the new photo to the set so the next
  // article in the loop doesn't pick the same one.
  const usedIds = new Set<number>();
  for (const r of rows) {
    const id = photoIdFromUrl(r.featuredImageUrl);
    if (id !== null) usedIds.add(id);
  }

  let okCount = 0;
  let skipCount = 0;
  let failCount = 0;

  if (refreshAll) {
    // Re-fetch every article's image with the new themed queries.
    // Useful when the previous backfill used generic queries (e.g.
    // "insurance hispanic family") that returned visually similar
    // photos despite unique IDs.
    const sorted = [...rows].sort((a, b) => a.slug.localeCompare(b.slug));
    for (const article of sorted) {
      const currentId = photoIdFromUrl(article.featuredImageUrl);
      // Drop current photo from the exclusion set so this article can
      // re-pick the same photo if it's still the best fit. Add it back
      // after fetching.
      if (currentId !== null) usedIds.delete(currentId);

      const query = buildVariedImageQuery(article.slug, article.category);
      const candidate = await fetchCandidates(query, usedIds);

      if (currentId !== null) usedIds.add(currentId);

      if (!candidate) {
        console.log(`  SKIP   ${article.slug} — no candidate for "${query}"`);
        skipCount += 1;
        continue;
      }

      if (candidate.id === currentId) {
        // Same photo would be selected. Leave article alone.
        skipCount += 1;
        continue;
      }

      usedIds.add(candidate.id);
      if (currentId !== null) usedIds.delete(currentId);
      const newUrl = candidate.src.landscape;

      if (!apply) {
        console.log(
          `  [DRY]  ${article.slug} ${currentId}→${candidate.id} (query: "${query}")`,
        );
        okCount += 1;
        continue;
      }

      try {
        await applyUpdate(article.slug, newUrl);
        console.log(
          `  [OK]   ${article.slug} ${currentId}→${candidate.id}`,
        );
        okCount += 1;
      } catch (err) {
        console.log(`  [ERR]  ${article.slug} —`, err);
        failCount += 1;
      }

      await new Promise((r) => setTimeout(r, 250));
    }

    console.log(
      `\nDone (refreshAll): ${okCount} ${apply ? "rewritten" : "would rewrite"}, ${skipCount} unchanged/skip, ${failCount} errored.`,
    );
    return;
  }

  // Default: target only duplicate clusters (cheap, focused).
  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    if (!r.featuredImageUrl) continue;
    const key = r.featuredImageUrl;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const duplicates = [...groups.entries()].filter(([, arr]) => arr.length > 1);
  if (duplicates.length === 0) {
    logger.info("No duplicate featured images — nothing to do");
    return;
  }

  for (const [sharedUrl, articlesInGroup] of duplicates) {
    const sortedSlugs = articlesInGroup
      .map((a) => a.slug)
      .sort()
      .join(",");
    console.log(
      `\n[GROUP] ${articlesInGroup.length} articles share ${photoIdFromUrl(sharedUrl)} (${sortedSlugs})`,
    );

    const sorted = [...articlesInGroup].sort((a, b) =>
      a.slug.localeCompare(b.slug),
    );
    const [keep, ...rest] = sorted;
    console.log(`  KEEP   ${keep.slug} on photo ${photoIdFromUrl(sharedUrl)}`);

    for (const article of rest) {
      const query = buildVariedImageQuery(article.slug, article.category);
      const candidate = await fetchCandidates(query, usedIds);

      if (!candidate) {
        console.log(`  SKIP   ${article.slug} — no fresh candidate for "${query}"`);
        skipCount += 1;
        continue;
      }

      usedIds.add(candidate.id);
      const newUrl = candidate.src.landscape;

      if (!apply) {
        console.log(`  [DRY]  ${article.slug} → photo ${candidate.id} (query: "${query}")`);
        okCount += 1;
        continue;
      }

      try {
        await applyUpdate(article.slug, newUrl);
        console.log(`  [OK]   ${article.slug} → photo ${candidate.id}`);
        okCount += 1;
      } catch (err) {
        console.log(`  [ERR]  ${article.slug} —`, err);
        failCount += 1;
      }

      await new Promise((r) => setTimeout(r, 250));
    }
  }

  console.log(
    `\nDone: ${okCount} ${apply ? "rewritten" : "would rewrite"}, ${skipCount} skipped (no fresh candidate), ${failCount} errored.`,
  );
}

function parseArgs(): RunOptions {
  const opts: RunOptions = {};
  for (const arg of process.argv.slice(2)) {
    if (arg === "--apply") opts.apply = true;
    if (arg === "--refresh-all") opts.refreshAll = true;
  }
  return opts;
}

if (require.main === module) {
  run(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Refresh failed");
    process.exit(1);
  });
}

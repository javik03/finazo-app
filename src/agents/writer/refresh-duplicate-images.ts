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

const CATEGORY_CONTEXT: Record<string, string> = {
  seguros: "insurance hispanic family",
  prestamos: "loan hispanic family",
  remesas: "remittance latino money transfer",
  tarjetas: "credit card hispanic",
  educacion: "family finance budgeting",
};

function buildImageQuery(slug: string, category: string): string {
  // Strip year + boilerplate suffixes, hyphens to spaces.
  const base = slug
    .replace(/-2026$/, "")
    .replace(/-2025$/, "")
    .replace(/-2024$/, "")
    .replace(/-resena$/, "")
    .replace(/^alternativa-a-/, "")
    .replace(/-hispanos?$/, "")
    .replace(/-/g, " ")
    .trim();
  const ctx = CATEGORY_CONTEXT[category] ?? "hispanic family";
  return `${base} ${ctx}`;
}

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

type RunOptions = { apply?: boolean };

export async function run(options: RunOptions = {}): Promise<void> {
  const apply = options.apply ?? false;
  const rows = await loadRows();
  logger.info({ total: rows.length, mode: apply ? "APPLY" : "DRY-RUN" }, "Loaded");

  // Group by current image URL to find duplicates.
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

  // Build the running "used" set seeded with every current ID, so when
  // we reassign we don't pick something already used elsewhere.
  const usedIds = new Set<number>();
  for (const r of rows) {
    const id = photoIdFromUrl(r.featuredImageUrl);
    if (id !== null) usedIds.add(id);
  }

  let okCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const [sharedUrl, articlesInGroup] of duplicates) {
    const sortedSlugs = articlesInGroup
      .map((a) => a.slug)
      .sort()
      .join(",");
    console.log(
      `\n[GROUP] ${articlesInGroup.length} articles share ${photoIdFromUrl(sharedUrl)} (${sortedSlugs})`,
    );

    // Keep the first article (alphabetical) on its current image,
    // reassign the rest.
    const sorted = [...articlesInGroup].sort((a, b) =>
      a.slug.localeCompare(b.slug),
    );
    const [keep, ...rest] = sorted;
    console.log(`  KEEP   ${keep.slug} on photo ${photoIdFromUrl(sharedUrl)}`);

    for (const article of rest) {
      const query = buildImageQuery(article.slug, article.category);
      const candidate = await fetchCandidates(query, usedIds);

      if (!candidate) {
        console.log(`  SKIP   ${article.slug} — no fresh candidate for query "${query}"`);
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

      // Gentle rate-limit between Pexels calls.
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
  }
  return opts;
}

if (require.main === module) {
  run(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Refresh failed");
    process.exit(1);
  });
}

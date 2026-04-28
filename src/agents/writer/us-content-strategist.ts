/**
 * US Content Strategist v2 — generates evergreen articles for finazo.us.
 *
 * Strategy:
 * - Plain-Spanish-first headlines ("sin Social Security"), ITIN as secondary
 * - E-E-A-T scaffolding: real authors, methodology citations, real-data tables
 * - Carrier-alternativa, legal-requirement-awareness, mortgage-non-QM,
 *   ACA / Medicaid, life insurance, credit-without-SSN, banking-without-SSN,
 *   remittance corridors, ITIN/W-7
 * - Author rotation: Javier (financial mechanics: loans, mortgage, credit,
 *   banking, remittances, ITIN) + Sabrina (insurance, health, life, awareness)
 * - IndexNow notifies finazo.us URLs (was broken — pointed to finazo.lat)
 * - Sets language="es", country="US", authorSlug, humanReviewed=false
 *
 * Entry points:
 *   npx tsx src/agents/writer/us-content-strategist.ts             # 3 articles
 *   npx tsx src/agents/writer/us-content-strategist.ts --batch=8   # 8 articles
 *   npx tsx src/agents/writer/us-content-strategist.ts --homepage  # only seed
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { notifyIndexNow } from "@/lib/indexnow";
import { fetchFeaturedImage } from "@/lib/pexels";
import pino from "pino";
import { config } from "@/lib/config";
import {
  US_CONTENT_CALENDAR,
  type UsContentTopic,
  type UsAuthorSlug,
} from "./us-content-calendar";

const logger = pino({ name: "us-content-strategist" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const AUTHOR_DISPLAY_NAMES: Record<UsAuthorSlug, string> = {
  "javier-keough": "Javier Keough",
  "sabrina-keough": "Sabrina Keough",
};

const DEFAULT_BATCH_SIZE = 3;
const MAX_BATCH_SIZE = 12;

// ---------------------------------------------------------------------------
// Single-article generator
// ---------------------------------------------------------------------------

async function generateUsArticle(topic: UsContentTopic): Promise<boolean> {
  logger.info({ slug: topic.slug, author: topic.preferredAuthor }, "Generating");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: topic.prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    logger.error({ slug: topic.slug }, "Unexpected response type from Claude");
    return false;
  }

  const fullText = content.text;

  const metaMatch = fullText.match(/META:\s*(.+)$/m);
  const metaDescription = metaMatch ? metaMatch[1].trim() : null;

  const keywordsMatch = fullText.match(/KEYWORDS:\s*\[?([^\]\n]+)/);
  const keywords = keywordsMatch
    ? keywordsMatch[1]
        .split(",")
        .map((k) => k.trim().replace(/[\[\]"']/g, ""))
        .filter(Boolean)
    : null;

  const articleContent = fullText
    .replace(/^META:.*$/m, "")
    .replace(/^KEYWORDS:.*$/m, "")
    .trim();

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim()
    : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  const featuredImageUrl = await fetchFeaturedImage(topic.imageQuery);

  await db
    .insert(articles)
    .values({
      slug: topic.slug,
      title,
      metaDescription,
      content: articleContent,
      category: topic.category,
      country: "US",
      language: "es",
      keywords: keywords ?? undefined,
      wordCount,
      featuredImageUrl,
      status: "published",
      publishedAt: new Date(),
      generatedBy: "claude",
      authorName: AUTHOR_DISPLAY_NAMES[topic.preferredAuthor],
      authorSlug: topic.preferredAuthor,
      humanReviewed: false,
      templateType: "editorial",
    })
    .onConflictDoNothing();

  // Notify the correct host (was pointing to finazo.lat — bug).
  await notifyIndexNow([`https://finazo.us/guias/${topic.slug}`]);

  logger.info(
    {
      slug: topic.slug,
      wordCount,
      category: topic.category,
      hasImage: Boolean(featuredImageUrl),
      keywordsCount: keywords?.length ?? 0,
    },
    "Published",
  );
  return true;
}

// ---------------------------------------------------------------------------
// Filter calendar by what's already in the DB
// ---------------------------------------------------------------------------

async function getMissingTopics(): Promise<UsContentTopic[]> {
  const allSlugs = US_CONTENT_CALENDAR.map((t) => t.slug);
  const existing = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(inArray(articles.slug, allSlugs));
  const existingSet = new Set(existing.map((r) => r.slug));
  return US_CONTENT_CALENDAR.filter((t) => !existingSet.has(t.slug));
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

type RunOptions = {
  batchSize?: number;
  homepageOnly?: boolean;
};

export async function runUsContentStrategist(
  options: RunOptions = {},
): Promise<void> {
  const batchSize = Math.min(
    options.batchSize ?? DEFAULT_BATCH_SIZE,
    MAX_BATCH_SIZE,
  );
  logger.info({ batchSize, homepageOnly: options.homepageOnly }, "Starting");

  const missing = await getMissingTopics();

  let candidates = missing;
  if (options.homepageOnly) {
    candidates = candidates.filter((t) => t.homepageSeed === true);
  }

  if (candidates.length === 0) {
    logger.info(
      { totalCalendar: US_CONTENT_CALENDAR.length, missing: missing.length },
      "Nothing to generate",
    );
    return;
  }

  logger.info(
    { available: candidates.length, willGenerate: Math.min(batchSize, candidates.length) },
    "Topics queued",
  );

  const batch = candidates.slice(0, batchSize);
  let succeeded = 0;
  let failed = 0;

  for (const topic of batch) {
    try {
      const ok = await generateUsArticle(topic);
      if (ok) {
        succeeded += 1;
      } else {
        failed += 1;
      }
      // Rate limit between Claude calls
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } catch (err) {
      failed += 1;
      logger.error({ err, slug: topic.slug }, "Generation failed");
    }
  }

  logger.info({ succeeded, failed }, "Strategist run complete");
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

function parseArgs(): RunOptions {
  const args = process.argv.slice(2);
  const opts: RunOptions = {};

  for (const arg of args) {
    if (arg === "--homepage") opts.homepageOnly = true;
    const batchMatch = arg.match(/^--batch=(\d+)$/);
    if (batchMatch) opts.batchSize = Number.parseInt(batchMatch[1], 10);
  }
  return opts;
}

if (require.main === module) {
  runUsContentStrategist(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Strategist failed");
    process.exit(1);
  });
}

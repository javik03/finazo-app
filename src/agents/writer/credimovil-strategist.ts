/**
 * CrediMóvil pSEO strategist — generates Salvadoran car-finance articles for
 * finazo.lat that route to credimovil.io.
 *
 * Runs alongside (not inside) the LATAM content-strategist. Articles land in
 * the same `articles` table with country="SV" + templateType="credimovil_pseo"
 * so they're filterable separately from organic LATAM editorial.
 *
 * Reuses the shared quality gate and inline-image resolver introduced in
 * Phase 1 — same Welter/E-E-A-T discipline.
 *
 * Entry points:
 *   npx tsx src/agents/writer/credimovil-strategist.ts             # 3 articles
 *   npx tsx src/agents/writer/credimovil-strategist.ts --batch=8   # 8 articles
 *   npx tsx src/agents/writer/credimovil-strategist.ts --refresh   # refresh stale
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { notifyIndexNow } from "@/lib/indexnow";
import { fetchFeaturedImage } from "@/lib/pexels";
import pino from "pino";
import { config } from "@/lib/config";
import { getAllCredimovilTopics, type CredimovilTopic } from "./credimovil-templates";
import { evaluateArticle, buildRetryInstructions, type QualityGateOptions } from "./quality-gate";
import { resolveInlineImages } from "./inline-images";

const logger = pino({ name: "credimovil-strategist" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const DEFAULT_BATCH_SIZE = 3;
const MAX_BATCH_SIZE = 12;
const MAX_QUALITY_RETRIES = 2;
const DEFAULT_REFRESH_AGE_DAYS = 60;
const TEMPLATE_TYPE = "credimovil_pseo";
const AUTHOR_NAME = "Javier Keough";
const AUTHOR_SLUG = "javier-keough";

// ─── Body generation ───────────────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string | null> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return null;
  return content.text;
}

function deriveQualityOptions(topic: CredimovilTopic): QualityGateOptions {
  return {
    minWordCount: topic.qualityGate?.minWordCount ?? 1300,
    allowMissingTable: topic.qualityGate?.allowMissingTable ?? false,
    allowMissingCallout: topic.qualityGate?.allowMissingCallout ?? false,
  };
}

type GeneratedArticle = {
  articleContent: string;
  metaDescription: string | null;
  keywords: string[] | null;
  title: string;
  wordCount: number;
};

async function generateBody(topic: CredimovilTopic): Promise<GeneratedArticle | null> {
  const qualityOptions = deriveQualityOptions(topic);

  let prompt = topic.prompt;
  let articleContent = "";
  let metaDescription: string | null = null;
  let keywords: string[] | null = null;
  let passed = false;

  for (let attempt = 0; attempt <= MAX_QUALITY_RETRIES; attempt += 1) {
    const fullText = await callClaude(prompt);
    if (fullText === null) {
      logger.error({ slug: topic.slug, attempt }, "Unexpected response type from Claude");
      return null;
    }

    const metaMatch = fullText.match(/META:\s*(.+)$/m);
    metaDescription = metaMatch ? metaMatch[1].trim() : null;

    const keywordsMatch = fullText.match(/KEYWORDS:\s*\[?([^\]\n]+)/);
    keywords = keywordsMatch
      ? keywordsMatch[1]
          .split(",")
          .map((k) => k.trim().replace(/[\[\]"']/g, ""))
          .filter(Boolean)
      : null;

    articleContent = fullText
      .replace(/^META:.*$/m, "")
      .replace(/^KEYWORDS:.*$/m, "")
      .trim();

    articleContent = await resolveInlineImages(articleContent);

    const gate = evaluateArticle(articleContent, qualityOptions);
    if (gate.pass) {
      logger.info({ slug: topic.slug, attempt, metrics: gate.metrics }, "Quality gate passed");
      passed = true;
      break;
    }

    logger.warn(
      { slug: topic.slug, attempt, reasons: gate.reasons, metrics: gate.metrics },
      "Quality gate failed",
    );

    if (attempt < MAX_QUALITY_RETRIES) {
      prompt = topic.prompt + buildRetryInstructions(gate);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (!passed) {
    logger.error(
      { slug: topic.slug, retries: MAX_QUALITY_RETRIES },
      "Quality gate failed after all retries — skipping article",
    );
    return null;
  }

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  return { articleContent, metaDescription, keywords, title, wordCount };
}

// ─── Persistence ───────────────────────────────────────────────────────────

async function insertArticle(topic: CredimovilTopic): Promise<boolean> {
  const body = await generateBody(topic);
  if (!body) return false;

  const { articleContent, metaDescription, keywords, title, wordCount } = body;
  const featuredImageUrl = await fetchFeaturedImage(topic.imageQuery);

  await db
    .insert(articles)
    .values({
      slug: topic.slug,
      title,
      metaDescription,
      content: articleContent,
      category: topic.category,
      country: topic.country,
      language: "es",
      keywords: keywords ?? undefined,
      wordCount,
      featuredImageUrl,
      status: "published",
      publishedAt: new Date(),
      generatedBy: "claude",
      authorName: AUTHOR_NAME,
      authorSlug: AUTHOR_SLUG,
      humanReviewed: false,
      templateType: TEMPLATE_TYPE,
    })
    .onConflictDoNothing();

  await notifyIndexNow([`https://finazo.lat/guias/${topic.slug}`]);

  logger.info(
    { slug: topic.slug, wordCount, hasImage: Boolean(featuredImageUrl) },
    "CrediMóvil article published",
  );
  return true;
}

async function updateArticle(topic: CredimovilTopic): Promise<boolean> {
  const body = await generateBody(topic);
  if (!body) return false;

  const { articleContent, metaDescription, keywords, title, wordCount } = body;

  await db
    .update(articles)
    .set({
      title,
      metaDescription,
      content: articleContent,
      keywords: keywords ?? undefined,
      wordCount,
      authorName: AUTHOR_NAME,
      authorSlug: AUTHOR_SLUG,
      updatedAt: sql`NOW()`,
    })
    .where(eq(articles.slug, topic.slug));

  await notifyIndexNow([`https://finazo.lat/guias/${topic.slug}`]);
  logger.info({ slug: topic.slug, wordCount }, "CrediMóvil article refreshed");
  return true;
}

// ─── Selection ─────────────────────────────────────────────────────────────

async function getMissingTopics(): Promise<CredimovilTopic[]> {
  const all = getAllCredimovilTopics();
  const allSlugs = all.map((t) => t.slug);

  const existing = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "SV"),
        inArray(articles.slug, allSlugs),
      ),
    );

  const existingSet = new Set(existing.map((r) => r.slug));
  return all.filter((t) => !existingSet.has(t.slug));
}

async function getStaleTopics(maxAgeDays: number): Promise<CredimovilTopic[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);

  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "SV"),
        eq(articles.templateType, TEMPLATE_TYPE),
        eq(articles.status, "published"),
        lt(articles.updatedAt, cutoff),
      ),
    );

  const staleSet = new Set(rows.map((r) => r.slug));
  return getAllCredimovilTopics().filter((t) => staleSet.has(t.slug));
}

// ─── Runners ───────────────────────────────────────────────────────────────

type RunOptions = {
  batchSize?: number;
  refresh?: boolean;
  refreshMaxAgeDays?: number;
};

export async function runCredimovilStrategist(
  options: RunOptions = {},
): Promise<void> {
  const batchSize = Math.min(options.batchSize ?? DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE);

  if (options.refresh) {
    const stale = await getStaleTopics(options.refreshMaxAgeDays ?? DEFAULT_REFRESH_AGE_DAYS);
    if (stale.length === 0) {
      logger.info("No stale CrediMóvil articles to refresh");
      return;
    }
    logger.info({ stale: stale.length, batchSize }, "Refresh candidates");
    const batch = stale.slice(0, batchSize);
    let ok = 0;
    let bad = 0;
    for (const topic of batch) {
      try {
        const success = await updateArticle(topic);
        if (success) ok += 1;
        else bad += 1;
        await new Promise((resolve) => setTimeout(resolve, 4000));
      } catch (err) {
        bad += 1;
        logger.error({ err, slug: topic.slug }, "Refresh failed");
      }
    }
    logger.info({ succeeded: ok, failed: bad }, "CrediMóvil refresh complete");
    return;
  }

  const missing = await getMissingTopics();
  if (missing.length === 0) {
    logger.info(
      { totalTopics: getAllCredimovilTopics().length },
      "All CrediMóvil topics already published",
    );
    return;
  }

  logger.info({ available: missing.length, batchSize }, "CrediMóvil topics queued");
  const batch = missing.slice(0, batchSize);
  let ok = 0;
  let bad = 0;
  for (const topic of batch) {
    try {
      const success = await insertArticle(topic);
      if (success) ok += 1;
      else bad += 1;
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } catch (err) {
      bad += 1;
      logger.error({ err, slug: topic.slug }, "Generation failed");
    }
  }
  logger.info({ succeeded: ok, failed: bad }, "CrediMóvil strategist run complete");
}

// ─── CLI ──────────────────────────────────────────────────────────────────

function parseArgs(): RunOptions {
  const args = process.argv.slice(2);
  const opts: RunOptions = {};
  for (const arg of args) {
    if (arg === "--refresh") opts.refresh = true;
    const batchMatch = arg.match(/^--batch=(\d+)$/);
    if (batchMatch) opts.batchSize = Number.parseInt(batchMatch[1], 10);
    const ageMatch = arg.match(/^--max-age-days=(\d+)$/);
    if (ageMatch) opts.refreshMaxAgeDays = Number.parseInt(ageMatch[1], 10);
  }
  return opts;
}

if (require.main === module) {
  runCredimovilStrategist(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "CrediMóvil strategist failed");
    process.exit(1);
  });
}

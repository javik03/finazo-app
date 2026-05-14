/**
 * English Lane A content strategist — spec §1.4.1.b / §1.7 / §4.4.
 *
 * Generates English helping-family articles for /en/[slug] on finazo.us.
 * Requires --confirm-english flag because per spec §6.5 the English ramp
 * should only begin after the user has verified a first sample passes the
 * translation-detection lint without manual intervention.
 *
 * Entry points:
 *   npx tsx src/agents/writer/en-content-strategist.ts --confirm-english --batch=1
 *   npx tsx src/agents/writer/en-content-strategist.ts --refresh --confirm-english
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { notifyIndexNow } from "@/lib/indexnow";
import { fetchFeaturedImage, getCurrentlyUsedImageIds } from "@/lib/pexels";
import { buildVariedImageQuery } from "@/lib/image-queries";
import pino from "pino";
import { config } from "@/lib/config";
import {
  getAllEnTopics,
  type EnContentTopic,
  type EnAuthorSlug,
} from "./en-content-templates";
import { evaluateArticle, buildRetryInstructions, type QualityGateOptions } from "./quality-gate";
import { detectTranslation, buildTranslationRetryInstructions } from "./translation-detection";
import { resolveInlineImages } from "./inline-images";

const logger = pino({ name: "en-content-strategist" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const DEFAULT_BATCH_SIZE = 1;
const MAX_BATCH_SIZE = 5;
const MAX_QUALITY_RETRIES = 2;
const MAX_TRANSLATION_RETRIES = 1;
const DEFAULT_REFRESH_AGE_DAYS = 90;
const NATIVENESS_THRESHOLD = 70;
const TEMPLATE_TYPE = "en_helping_family";

const AUTHOR_DISPLAY_NAMES: Record<EnAuthorSlug, string> = {
  "javier-keough": "Javier Keough",
  "sabrina-keough": "Sabrina Keough",
};

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

function deriveQualityOptions(topic: EnContentTopic): QualityGateOptions {
  return {
    minWordCount: topic.qualityGate?.minWordCount ?? 1500,
    allowMissingTable: topic.qualityGate?.allowMissingTable ?? false,
    allowMissingCallout: topic.qualityGate?.allowMissingCallout ?? false,
    category: topic.category,
  };
}

type GeneratedArticle = {
  articleContent: string;
  metaDescription: string | null;
  keywords: string[] | null;
  title: string;
  wordCount: number;
};

async function generateBody(topic: EnContentTopic): Promise<GeneratedArticle | null> {
  const qualityOptions = deriveQualityOptions(topic);

  let prompt = topic.prompt;
  let articleContent = "";
  let metaDescription: string | null = null;
  let keywords: string[] | null = null;
  let qualityPassed = false;

  // Phase 1: quality gate retry loop (same as us-content-strategist).
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
      qualityPassed = true;
      break;
    }

    logger.warn({ slug: topic.slug, attempt, reasons: gate.reasons }, "Quality gate failed");
    if (attempt < MAX_QUALITY_RETRIES) {
      prompt = topic.prompt + buildRetryInstructions(gate);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (!qualityPassed) {
    logger.error({ slug: topic.slug }, "Quality gate failed all retries — skipping");
    return null;
  }

  // Phase 2: translation-detection retry loop. Spec §4.4 — block insertion
  // when the English text exhibits translation-from-Spanish markers.
  let translationOk = false;
  for (let attempt = 0; attempt <= MAX_TRANSLATION_RETRIES; attempt += 1) {
    const check = detectTranslation(articleContent, { threshold: NATIVENESS_THRESHOLD });
    if (!check.looksTranslated) {
      logger.info(
        { slug: topic.slug, nativenessScore: check.nativenessScore, markers: check.markers.length },
        "Translation detection passed",
      );
      translationOk = true;
      break;
    }

    logger.warn(
      { slug: topic.slug, attempt, nativenessScore: check.nativenessScore, markers: check.markers },
      "Translation detection flagged — looks translated",
    );

    if (attempt < MAX_TRANSLATION_RETRIES) {
      // Re-prompt with translation-specific feedback.
      const retryPrompt = topic.prompt + buildTranslationRetryInstructions(check);
      const retryText = await callClaude(retryPrompt);
      if (retryText === null) break;
      articleContent = retryText
        .replace(/^META:.*$/m, "")
        .replace(/^KEYWORDS:.*$/m, "")
        .trim();
      articleContent = await resolveInlineImages(articleContent);
      const retryMeta = retryText.match(/META:\s*(.+)$/m);
      if (retryMeta) metaDescription = retryMeta[1].trim();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (!translationOk) {
    logger.error(
      { slug: topic.slug },
      "Translation detection failed all retries — skipping article (article would damage bilingual structure)",
    );
    return null;
  }

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  return { articleContent, metaDescription, keywords, title, wordCount };
}

// ─── Persistence ───────────────────────────────────────────────────────────

async function insertArticle(topic: EnContentTopic): Promise<boolean> {
  const body = await generateBody(topic);
  if (!body) return false;

  const { articleContent, metaDescription, keywords, title, wordCount } = body;
  const usedImageIds = await getCurrentlyUsedImageIds().catch(() => new Set<number>());
  // Themed query — see us-content-strategist.ts for rationale.
  const themedQuery = buildVariedImageQuery(topic.slug, topic.category);
  const featuredImageUrl = await fetchFeaturedImage(themedQuery, {
    exclude: usedImageIds,
  });

  await db
    .insert(articles)
    .values({
      slug: topic.slug,
      title,
      metaDescription,
      content: articleContent,
      category: topic.category,
      country: "US",
      language: "en",
      keywords: keywords ?? undefined,
      wordCount,
      featuredImageUrl,
      status: "published",
      publishedAt: new Date(),
      generatedBy: "claude",
      authorName: AUTHOR_DISPLAY_NAMES[topic.preferredAuthor],
      authorSlug: topic.preferredAuthor,
      humanReviewed: false,
      templateType: TEMPLATE_TYPE,
      templateVariables: { cluster: topic.cluster },
    })
    .onConflictDoNothing();

  await notifyIndexNow([`https://finazo.us/en/${topic.slug}`]);

  logger.info({ slug: topic.slug, wordCount }, "English Lane A article published");
  return true;
}

async function updateArticle(topic: EnContentTopic): Promise<boolean> {
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
      authorName: AUTHOR_DISPLAY_NAMES[topic.preferredAuthor],
      authorSlug: topic.preferredAuthor,
      updatedAt: sql`NOW()`,
    })
    .where(eq(articles.slug, topic.slug));
  await notifyIndexNow([`https://finazo.us/en/${topic.slug}`]);
  logger.info({ slug: topic.slug, wordCount }, "English Lane A article refreshed");
  return true;
}

// ─── Selection ─────────────────────────────────────────────────────────────

async function getMissingTopics(): Promise<EnContentTopic[]> {
  const all = getAllEnTopics();
  const allSlugs = all.map((t) => t.slug);
  const existing = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        eq(articles.language, "en"),
        inArray(articles.slug, allSlugs),
      ),
    );
  const set = new Set(existing.map((r) => r.slug));
  return all.filter((t) => !set.has(t.slug));
}

async function getStaleTopics(maxAgeDays: number): Promise<EnContentTopic[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);
  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        eq(articles.language, "en"),
        eq(articles.templateType, TEMPLATE_TYPE),
        eq(articles.status, "published"),
        lt(articles.updatedAt, cutoff),
      ),
    );
  const stale = new Set(rows.map((r) => r.slug));
  return getAllEnTopics().filter((t) => stale.has(t.slug));
}

// ─── Runner ────────────────────────────────────────────────────────────────

type RunOptions = {
  batchSize?: number;
  refresh?: boolean;
  refreshMaxAgeDays?: number;
  confirmEnglish?: boolean;
};

export async function runEnContentStrategist(options: RunOptions = {}): Promise<void> {
  if (!options.confirmEnglish) {
    logger.error(
      "English content generation requires --confirm-english flag. Per spec §6.5, the English ramp begins only after the writer has verified a sample passes the translation-detection lint without manual intervention. Pass --confirm-english to acknowledge.",
    );
    return;
  }

  const batchSize = Math.min(options.batchSize ?? DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE);

  if (options.refresh) {
    const stale = await getStaleTopics(options.refreshMaxAgeDays ?? DEFAULT_REFRESH_AGE_DAYS);
    if (stale.length === 0) {
      logger.info("No stale English articles to refresh");
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
    logger.info({ succeeded: ok, failed: bad }, "English refresh complete");
    return;
  }

  const missing = await getMissingTopics();
  if (missing.length === 0) {
    logger.info({ totalTopics: getAllEnTopics().length }, "All English topics already published");
    return;
  }

  logger.info({ available: missing.length, batchSize }, "English topics queued");
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
  logger.info({ succeeded: ok, failed: bad }, "English strategist run complete");
}

function parseArgs(): RunOptions {
  const args = process.argv.slice(2);
  const opts: RunOptions = {};
  for (const arg of args) {
    if (arg === "--refresh") opts.refresh = true;
    if (arg === "--confirm-english") opts.confirmEnglish = true;
    const batchMatch = arg.match(/^--batch=(\d+)$/);
    if (batchMatch) opts.batchSize = Number.parseInt(batchMatch[1], 10);
    const ageMatch = arg.match(/^--max-age-days=(\d+)$/);
    if (ageMatch) opts.refreshMaxAgeDays = Number.parseInt(ageMatch[1], 10);
  }
  return opts;
}

if (require.main === module) {
  runEnContentStrategist(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "English strategist failed");
    process.exit(1);
  });
}

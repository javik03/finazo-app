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
import { articles, usTopicProposals } from "@/lib/db/schema";
import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { notifyIndexNow } from "@/lib/indexnow";
import { fetchFeaturedImage } from "@/lib/pexels";
import pino from "pino";
import { config } from "@/lib/config";
import {
  US_CONTENT_CALENDAR,
  type UsContentTopic,
  type UsAuthorSlug,
} from "./us-content-calendar";
import { getAllProgrammaticTopics } from "./us-topic-templates";
import {
  evaluateArticle,
  buildRetryInstructions,
  type QualityGateOptions,
} from "./quality-gate";
import { resolveInlineImages } from "./inline-images";
import {
  detectOepMode,
  prioritizeForOep,
  type OepMode,
} from "./oep-cadence";

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

const MAX_QUALITY_RETRIES = 2;

async function callClaudeForArticle(prompt: string): Promise<string | null> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return null;
  return content.text;
}

function deriveQualityOptions(topic: UsContentTopic): QualityGateOptions {
  // Glossary topics (que-es-*) are shorter explainers with no comparison table
  // requirement. Everything else uses the standard 1200-word floor + table.
  const isGlossary = topic.slug.startsWith("que-es-");
  return {
    minWordCount: topic.qualityGate?.minWordCount ?? (isGlossary ? 800 : 1200),
    allowMissingTable: topic.qualityGate?.allowMissingTable ?? isGlossary,
    allowMissingCallout: topic.qualityGate?.allowMissingCallout ?? false,
    // Passes through so the gate can activate insurance-compliance checks
    // (CFPB ban, sourced-or-hedged competitor claims, sourced pricing).
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

/**
 * Generate body + metadata for a topic, with quality-gate retries.
 * Returns null when all retries fail. No DB writes.
 */
async function generateArticleBody(
  topic: UsContentTopic,
): Promise<GeneratedArticle | null> {
  const qualityOptions = deriveQualityOptions(topic);

  let prompt = topic.prompt;
  let articleContent = "";
  let metaDescription: string | null = null;
  let keywords: string[] | null = null;
  let passed = false;

  for (let attempt = 0; attempt <= MAX_QUALITY_RETRIES; attempt += 1) {
    const fullText = await callClaudeForArticle(prompt);
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

async function generateUsArticle(topic: UsContentTopic): Promise<boolean> {
  logger.info({ slug: topic.slug, author: topic.preferredAuthor }, "Generating");

  const body = await generateArticleBody(topic);
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
      templateVariables: topic.templateVariables ?? undefined,
    })
    .onConflictDoNothing();

  await notifyIndexNow([`https://finazo.us/guias/${topic.slug}`]);
  await markProposalPublished(topic.slug);

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
// Topic source aggregation
// ---------------------------------------------------------------------------
// Unified source: hardcoded calendar ∪ programmatic templates ∪ approved
// proposals from the DB. Order = priority (calendar first, then templates,
// then DB proposals). Deduplication by slug — first occurrence wins.

async function getApprovedProposals(): Promise<UsContentTopic[]> {
  try {
    const rows = await db
      .select()
      .from(usTopicProposals)
      .where(eq(usTopicProposals.status, "approved"));

    return rows.map((r): UsContentTopic => ({
      slug: r.slug,
      category: r.category as UsContentTopic["category"],
      imageQuery: r.imageQuery ?? `${r.category} hispanic family`,
      preferredAuthor: r.preferredAuthor as UsAuthorSlug,
      prompt: r.promptText,
    }));
  } catch (err) {
    logger.warn({ err }, "Failed to load approved proposals — continuing with calendar + templates only");
    return [];
  }
}

function dedupeBySlug(topics: UsContentTopic[]): UsContentTopic[] {
  const seen = new Set<string>();
  const result: UsContentTopic[] = [];
  for (const t of topics) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    result.push(t);
  }
  return result;
}

async function getAllTopics(): Promise<UsContentTopic[]> {
  const proposals = await getApprovedProposals();
  return dedupeBySlug([
    ...US_CONTENT_CALENDAR,        // 1st: hand-curated, highest priority
    ...getAllProgrammaticTopics(), // 2nd: template-generated
    ...proposals,                  // 3rd: GSC/internal proposals
  ]);
}

async function getMissingTopics(): Promise<UsContentTopic[]> {
  const all = await getAllTopics();
  const allSlugs = all.map((t) => t.slug);

  // Chunk the IN-clause to avoid Postgres parameter limits when the topic
  // pool grows past ~32k. Stays performant well past 1000 topics.
  const existing = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        inArray(articles.slug, allSlugs),
      ),
    );

  const existingSet = new Set(existing.map((r) => r.slug));
  return all.filter((t) => !existingSet.has(t.slug));
}

/**
 * After a proposal-sourced topic publishes, mark the proposal row as
 * 'published' so the queue stays clean.
 */
async function markProposalPublished(slug: string): Promise<void> {
  try {
    await db
      .update(usTopicProposals)
      .set({ status: "published", publishedSlug: slug, updatedAt: new Date() })
      .where(eq(usTopicProposals.slug, slug));
  } catch (err) {
    // Non-fatal — proposal might not exist if topic came from calendar/templates
    logger.debug({ slug, err }, "No proposal row to update (expected for calendar/template topics)");
  }
}

// ---------------------------------------------------------------------------
// Refresh mode — regenerate stale articles for AI-citation freshness
// ---------------------------------------------------------------------------
// AI engines (Perplexity, ChatGPT, Gemini) weight pages with fresh dateModified
// more heavily when citing. Articles older than 60 days get regenerated with
// current data + the new quality gate, then updatedAt bumps so the JSON-LD
// dateModified updates and IndexNow re-pings.

const DEFAULT_REFRESH_AGE_DAYS = 60;

async function findStaleArticleSlugs(maxAgeDays: number): Promise<string[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);

  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        eq(articles.status, "published"),
        lt(articles.updatedAt, cutoff),
      ),
    );

  return rows.map((r) => r.slug);
}

async function refreshUsArticle(topic: UsContentTopic): Promise<boolean> {
  logger.info({ slug: topic.slug }, "Refreshing stale article");

  const body = await generateArticleBody(topic);
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
      // sql`NOW()` forces a fresh timestamp even when no other field changed
      updatedAt: sql`NOW()`,
    })
    .where(eq(articles.slug, topic.slug));

  await notifyIndexNow([`https://finazo.us/guias/${topic.slug}`]);

  logger.info({ slug: topic.slug, wordCount }, "Refreshed");
  return true;
}

export async function runUsContentRefresh(opts: {
  maxAgeDays?: number;
  batchSize?: number;
} = {}): Promise<void> {
  const maxAgeDays = opts.maxAgeDays ?? DEFAULT_REFRESH_AGE_DAYS;
  const batchSize = Math.min(opts.batchSize ?? DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE);

  const staleSlugs = await findStaleArticleSlugs(maxAgeDays);
  if (staleSlugs.length === 0) {
    logger.info({ maxAgeDays }, "No stale articles to refresh");
    return;
  }

  const allTopics = await getAllTopics();
  const topicBySlug = new Map(allTopics.map((t) => [t.slug, t]));

  // Only refresh articles where we still have the original topic prompt; one-off
  // articles without a topic stay as-is rather than being regenerated from a
  // guessed prompt.
  const refreshable = staleSlugs
    .map((s) => topicBySlug.get(s))
    .filter((t): t is UsContentTopic => Boolean(t));

  logger.info(
    { staleCount: staleSlugs.length, refreshable: refreshable.length, batchSize },
    "Refresh candidates",
  );

  const batch = refreshable.slice(0, batchSize);
  let succeeded = 0;
  let failed = 0;
  for (const topic of batch) {
    try {
      const ok = await refreshUsArticle(topic);
      if (ok) succeeded += 1;
      else failed += 1;
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } catch (err) {
      failed += 1;
      logger.error({ err, slug: topic.slug }, "Refresh failed");
    }
  }
  logger.info({ succeeded, failed }, "Refresh run complete");
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

type RunOptions = {
  batchSize?: number;
  homepageOnly?: boolean;
  refresh?: boolean;
  refreshMaxAgeDays?: number;
  /** Override the auto-detected OEP mode. Spec §8.6.4. */
  oepMode?: OepMode;
};

export async function runUsContentStrategist(
  options: RunOptions = {},
): Promise<void> {
  if (options.refresh) {
    await runUsContentRefresh({
      maxAgeDays: options.refreshMaxAgeDays,
      batchSize: options.batchSize,
    });
    return;
  }

  const batchSize = Math.min(
    options.batchSize ?? DEFAULT_BATCH_SIZE,
    MAX_BATCH_SIZE,
  );
  const oepMode = options.oepMode ?? detectOepMode();
  logger.info({ batchSize, homepageOnly: options.homepageOnly, oepMode }, "Starting");

  const missing = await getMissingTopics();

  let candidates = missing;
  if (options.homepageOnly) {
    candidates = candidates.filter((t) => t.homepageSeed === true);
  }

  // Spec §8.6.4 — during OEP preparation (Aug-Oct) and active (Nov 1 - Jan 15)
  // windows, ACA topics float to the front of the queue.
  candidates = prioritizeForOep(candidates, oepMode);

  if (candidates.length === 0) {
    const allTopics = await getAllTopics();
    logger.info(
      {
        totalTopics: allTopics.length,
        calendarTopics: US_CONTENT_CALENDAR.length,
        missing: missing.length,
      },
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
    if (arg === "--refresh") opts.refresh = true;
    const batchMatch = arg.match(/^--batch=(\d+)$/);
    if (batchMatch) opts.batchSize = Number.parseInt(batchMatch[1], 10);
    const ageMatch = arg.match(/^--max-age-days=(\d+)$/);
    if (ageMatch) opts.refreshMaxAgeDays = Number.parseInt(ageMatch[1], 10);
    const oepMatch = arg.match(/^--oep-mode=(preparation|active|post)$/);
    if (oepMatch) opts.oepMode = oepMatch[1] as OepMode;
  }
  return opts;
}

if (require.main === module) {
  runUsContentStrategist(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Strategist failed");
    process.exit(1);
  });
}

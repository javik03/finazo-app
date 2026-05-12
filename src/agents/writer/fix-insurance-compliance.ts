/**
 * Insurance compliance rewriter — one-off remediation script.
 *
 * Background: existing published articles under category="seguros" cite CFPB
 * as a source for insurance complaint data (CFPB has no jurisdiction over
 * insurance per Dodd-Frank § 1027(f) — data lives at NAIC + state DOIs),
 * state flat pricing claims without sources, and make unsourced competitor
 * claims (Lanham Act § 43(a) and FDUTPA exposure). The strategist's prompt
 * templates were the root cause (they explicitly instructed Claude to use
 * "CFPB complaint counts" as a section heading). Templates are now fixed
 * and the quality gate has insurance-specific compliance rules, but the
 * already-published articles need to be rewritten.
 *
 * This script:
 *   1. Lists every published category="seguros" article that fails the new
 *      insurance-compliance lint or contains a CFPB reference.
 *   2. For each, regenerates body via the original topic prompt (which now
 *      carries the new compliance rules) and runs the gate with
 *      category="seguros" so the insurance checks activate.
 *   3. Updates the article in place (content + updatedAt bump) on pass.
 *   4. Logs a summary CSV-style line per article so the run is auditable.
 *
 * Decision 1 (Cubierto branding) and Decision 2 (author byline) per the spec
 * are NOT applied here — those require an explicit user choice between Path A
 * and Path B. The script flags articles where these decisions apply but does
 * not auto-toggle the branding.
 *
 * Entry points:
 *   npx tsx src/agents/writer/fix-insurance-compliance.ts                 # dry run
 *   npx tsx src/agents/writer/fix-insurance-compliance.ts --apply         # write changes
 *   npx tsx src/agents/writer/fix-insurance-compliance.ts --apply --batch=5
 *   npx tsx src/agents/writer/fix-insurance-compliance.ts --slugs=a,b,c   # explicit list
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { notifyIndexNow } from "@/lib/indexnow";
import pino from "pino";
import { config } from "@/lib/config";
import { US_CONTENT_CALENDAR, type UsContentTopic } from "./us-content-calendar";
import { getAllProgrammaticTopics } from "./us-topic-templates";
import { evaluateArticle, buildRetryInstructions, type QualityGateOptions } from "./quality-gate";
import { resolveInlineImages } from "./inline-images";

const logger = pino({ name: "fix-insurance-compliance" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const MAX_QUALITY_RETRIES = 2;
const DEFAULT_BATCH_SIZE = 3;
const MAX_BATCH_SIZE = 12;

// ─── Detection: which articles need fixing ────────────────────────────────

type AffectedArticle = {
  id: string;
  slug: string;
  category: string;
  content: string;
  templateVariables: unknown;
  /** Why we flagged it — used in dry-run output. */
  reasons: string[];
};

async function findAffectedArticles(explicitSlugs?: string[]): Promise<AffectedArticle[]> {
  const rows = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      category: articles.category,
      content: articles.content,
      templateVariables: articles.templateVariables,
    })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        eq(articles.status, "published"),
        eq(articles.category, "seguros"),
      ),
    );

  const filtered = explicitSlugs && explicitSlugs.length > 0
    ? rows.filter((r) => explicitSlugs.includes(r.slug))
    : rows;

  // Run the new insurance compliance lint to find offenders.
  const affected: AffectedArticle[] = [];
  for (const row of filtered) {
    const gate = evaluateArticle(row.content, { category: "seguros", minWordCount: 600 });
    const insuranceReasons = (gate.metrics.insuranceCompliance?.cfpbMentions ?? 0) > 0
      || (gate.metrics.insuranceCompliance?.unsourcedPricingClaims?.length ?? 0) > 0
      || (gate.metrics.insuranceCompliance?.unsourcedCompetitorClaims?.length ?? 0) > 0;
    if (insuranceReasons) {
      affected.push({
        id: row.id,
        slug: row.slug,
        category: row.category,
        content: row.content,
        templateVariables: row.templateVariables,
        reasons: gate.reasons.filter((r) =>
          r.includes("CFPB") || r.includes("precio") || r.includes("carrier") || r.includes("sin fuente"),
        ),
      });
    }
  }
  return affected;
}

// ─── Topic lookup ─────────────────────────────────────────────────────────

function buildTopicIndex(): Map<string, UsContentTopic> {
  const all = [...US_CONTENT_CALENDAR, ...getAllProgrammaticTopics()];
  const map = new Map<string, UsContentTopic>();
  for (const t of all) {
    if (!map.has(t.slug)) map.set(t.slug, t);
  }
  return map;
}

// ─── Rewrite loop ─────────────────────────────────────────────────────────

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

type Rewritten = {
  articleContent: string;
  metaDescription: string | null;
  keywords: string[] | null;
  title: string;
  wordCount: number;
};

async function rewriteArticle(topic: UsContentTopic): Promise<Rewritten | null> {
  const qualityOptions: QualityGateOptions = {
    minWordCount: topic.qualityGate?.minWordCount ?? 1200,
    allowMissingTable: topic.qualityGate?.allowMissingTable ?? false,
    allowMissingCallout: topic.qualityGate?.allowMissingCallout ?? false,
    category: topic.category,
  };

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
      logger.info({ slug: topic.slug, attempt, metrics: gate.metrics }, "Quality + insurance compliance gate passed");
      passed = true;
      break;
    }

    logger.warn(
      { slug: topic.slug, attempt, reasons: gate.reasons.slice(0, 3) },
      "Gate failed — retrying with feedback",
    );

    if (attempt < MAX_QUALITY_RETRIES) {
      prompt = topic.prompt + buildRetryInstructions(gate);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (!passed) {
    logger.error({ slug: topic.slug }, "Failed all rewrites — leaving article unchanged");
    return null;
  }

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  return { articleContent, metaDescription, keywords, title, wordCount };
}

async function applyRewrite(slug: string, rewritten: Rewritten): Promise<void> {
  await db
    .update(articles)
    .set({
      title: rewritten.title,
      metaDescription: rewritten.metaDescription,
      content: rewritten.articleContent,
      keywords: rewritten.keywords ?? undefined,
      wordCount: rewritten.wordCount,
      updatedAt: sql`NOW()`,
    })
    .where(eq(articles.slug, slug));
  await notifyIndexNow([`https://finazo.us/guias/${slug}`]);
}

// ─── Runner ────────────────────────────────────────────────────────────────

type RunOptions = {
  apply?: boolean;
  batchSize?: number;
  slugs?: string[];
};

export async function runFixInsuranceCompliance(options: RunOptions = {}): Promise<void> {
  const apply = options.apply ?? false;
  const batchSize = Math.min(options.batchSize ?? DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE);

  const affected = await findAffectedArticles(options.slugs);
  if (affected.length === 0) {
    logger.info("No insurance-compliance violations found in published articles");
    return;
  }

  logger.info({ count: affected.length, mode: apply ? "APPLY" : "DRY-RUN" }, "Affected articles found");

  // Dry-run mode: just print what would change.
  if (!apply) {
    console.log("\n=== DRY RUN — articles flagged for rewrite ===\n");
    for (const a of affected) {
      console.log(`SLUG: ${a.slug}`);
      for (const reason of a.reasons) {
        console.log(`  - ${reason}`);
      }
      console.log("");
    }
    console.log(`Total: ${affected.length} articles.\nRun with --apply to rewrite, or --slugs=a,b,c to scope.`);
    return;
  }

  // Apply mode: rewrite up to batchSize articles.
  const topicIndex = buildTopicIndex();
  const orphans = affected.filter((a) => !topicIndex.has(a.slug));
  if (orphans.length > 0) {
    logger.warn(
      { count: orphans.length, sampleSlugs: orphans.slice(0, 3).map((o) => o.slug) },
      "Articles without matching topic prompt — cannot auto-rewrite",
    );
  }

  const rewriteable = affected.filter((a) => topicIndex.has(a.slug)).slice(0, batchSize);
  logger.info({ rewriting: rewriteable.length, deferred: affected.length - rewriteable.length }, "Starting rewrites");

  let succeeded = 0;
  let failed = 0;
  for (const a of rewriteable) {
    const topic = topicIndex.get(a.slug);
    if (!topic) {
      failed += 1;
      continue;
    }
    try {
      const rewritten = await rewriteArticle(topic);
      if (rewritten) {
        await applyRewrite(a.slug, rewritten);
        succeeded += 1;
        console.log(`[OK]   ${a.slug} — rewritten (${rewritten.wordCount} words)`);
      } else {
        failed += 1;
        console.log(`[FAIL] ${a.slug} — could not pass gate after retries`);
      }
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } catch (err) {
      failed += 1;
      logger.error({ err, slug: a.slug }, "Rewrite errored");
    }
  }

  console.log(`\nRun complete: ${succeeded} rewritten, ${failed} failed/orphan.`);
  if (orphans.length > 0) {
    console.log(`\n${orphans.length} affected article(s) have no matching topic prompt — manual rewrite required:`);
    for (const o of orphans) console.log(`  - ${o.slug}`);
  }
  console.log(
    "\nReminder: Decisions 1 (Cubierto branding) and 2 (author byline) from finazo-insurance-compliance.md require explicit user choice — they are NOT auto-applied by this script.",
  );
}

function parseArgs(): RunOptions {
  const args = process.argv.slice(2);
  const opts: RunOptions = {};
  for (const arg of args) {
    if (arg === "--apply") opts.apply = true;
    const batchMatch = arg.match(/^--batch=(\d+)$/);
    if (batchMatch) opts.batchSize = Number.parseInt(batchMatch[1], 10);
    const slugsMatch = arg.match(/^--slugs=(.+)$/);
    if (slugsMatch) opts.slugs = slugsMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
  }
  return opts;
}

if (require.main === module) {
  runFixInsuranceCompliance(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Insurance compliance fix failed");
    process.exit(1);
  });
}

/**
 * Surgical removal of in-body affiliate-disclosure callouts.
 *
 * Per the NerdWallet pattern, affiliate disclosure should live on the
 * /legal page + persistent footer, NOT as a callout repeated inside every
 * article. The earlier rewriter and prompts mandated a "> **Divulgación:**"
 * block in every article body; this script strips that out cleanly without
 * regenerating the full article (which would cost tokens + risk introducing
 * new gate failures).
 *
 * Patterns removed:
 *   1. Horizontal-rule wrapped blockquote: `\n---\n> **Divulgación:** ...\n---\n`
 *   2. Bare blockquote: `> **Divulgación:** ...` (possibly multiline)
 *   3. H2 section: `## Divulgación: ...` and its body until the next H2 or EOF
 *
 * Dry-run by default. Pass --apply to commit changes.
 *
 * Entry points:
 *   npx tsx src/agents/writer/strip-disclosure-callouts.ts            # dry-run
 *   npx tsx src/agents/writer/strip-disclosure-callouts.ts --apply    # commit
 */

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { notifyIndexNow } from "@/lib/indexnow";
import pino from "pino";

const logger = pino({ name: "strip-disclosure-callouts" });

const DIVULGACION_HR_BLOCKQUOTE =
  /\n*---\n+>\s*\*\*Divulgaci[oó]n:\*\*[^\n]*(?:\n>[^\n]*)*\n+---\n*/g;
const DIVULGACION_BARE_BLOCKQUOTE =
  /\n*>\s*\*\*Divulgaci[oó]n:\*\*[^\n]*(?:\n>[^\n]*)*\n*/g;
const DIVULGACION_H2 =
  /\n*##\s+Divulgaci[oó]n:?[^\n]*\n+(?:(?!##\s)[\s\S])*/g;
const DISCLOSURE_HR_BLOCKQUOTE =
  /\n*---\n+>\s*\*\*Disclosure:\*\*[^\n]*(?:\n>[^\n]*)*\n+---\n*/g;
const DISCLOSURE_BARE_BLOCKQUOTE =
  /\n*>\s*\*\*Disclosure:\*\*[^\n]*(?:\n>[^\n]*)*\n*/g;
const DISCLOSURE_H2 =
  /\n*##\s+Disclosure:?[^\n]*\n+(?:(?!##\s)[\s\S])*/g;

function strip(content: string): string {
  return content
    .replace(DIVULGACION_HR_BLOCKQUOTE, "\n\n")
    .replace(DISCLOSURE_HR_BLOCKQUOTE, "\n\n")
    .replace(DIVULGACION_BARE_BLOCKQUOTE, "\n\n")
    .replace(DISCLOSURE_BARE_BLOCKQUOTE, "\n\n")
    .replace(DIVULGACION_H2, "\n\n")
    .replace(DISCLOSURE_H2, "\n\n")
    // Collapse 3+ consecutive newlines to exactly two
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}

function countDivulgacion(content: string): number {
  return (content.match(/\*\*Divulgaci[oó]n:\*\*/g) ?? []).length
    + (content.match(/##\s+Divulgaci[oó]n:?/g) ?? []).length
    + (content.match(/\*\*Disclosure:\*\*/g) ?? []).length
    + (content.match(/##\s+Disclosure:?/g) ?? []).length;
}

type Row = { slug: string; content: string; updatedAt: Date | null };

async function findAffectedRows(): Promise<Row[]> {
  const rows = await db
    .select({
      slug: articles.slug,
      content: articles.content,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        eq(articles.status, "published"),
      ),
    );
  return rows.filter((r) => countDivulgacion(r.content) > 0);
}

async function applyStrip(slug: string, newContent: string): Promise<void> {
  const wordCount = newContent.split(/\s+/).filter(Boolean).length;
  await db
    .update(articles)
    .set({
      content: newContent,
      wordCount,
      updatedAt: sql`NOW()`,
    })
    .where(eq(articles.slug, slug));
  // Best-effort IndexNow ping; failures don't block the strip
  await notifyIndexNow([`https://finazo.us/guias/${slug}`]).catch(() => {});
}

type RunOptions = { apply?: boolean };

export async function runStripDisclosureCallouts(options: RunOptions = {}): Promise<void> {
  const apply = options.apply ?? false;
  const rows = await findAffectedRows();

  if (rows.length === 0) {
    logger.info("No articles with in-body disclosure callouts found");
    return;
  }

  logger.info({ count: rows.length, mode: apply ? "APPLY" : "DRY-RUN" }, "Affected articles");

  let okCount = 0;
  let unchangedCount = 0;
  let failCount = 0;

  for (const row of rows) {
    const before = countDivulgacion(row.content);
    const stripped = strip(row.content);
    const after = countDivulgacion(stripped);

    if (before === 0) {
      unchangedCount += 1;
      continue;
    }

    if (after > 0) {
      console.log(`[PARTIAL] ${row.slug} — before=${before} after=${after} (regex did not catch everything)`);
      failCount += 1;
      continue;
    }

    const sizeDiff = row.content.length - stripped.length;

    if (!apply) {
      console.log(`[DRY-RUN] ${row.slug} — would strip ${before} callout(s), -${sizeDiff} bytes`);
      okCount += 1;
      continue;
    }

    try {
      await applyStrip(row.slug, stripped);
      console.log(`[OK]      ${row.slug} — stripped ${before} callout(s), -${sizeDiff} bytes`);
      okCount += 1;
    } catch (err) {
      console.log(`[ERR]     ${row.slug} —`, err);
      failCount += 1;
    }
  }

  console.log(
    `\nDone: ${okCount} ${apply ? "stripped" : "would strip"}, ${failCount} partial/error, ${unchangedCount} unchanged.`,
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
  runStripDisclosureCallouts(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Strip failed");
    process.exit(1);
  });
}

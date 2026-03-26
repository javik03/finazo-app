/**
 * Bulk regenerate all articles in the database.
 * Runs via: docker exec <writer-strategist-container> npx tsx src/scripts/regenerate-all.ts
 *
 * Each article is regenerated with fresh Claude content + Pexels image.
 * Skips any slug not found in CONTENT_CALENDAR (logs a warning).
 */

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { regenerateEvergreenArticle } from "@/agents/writer/content-strategist";
import pino from "pino";

const logger = pino({ name: "regenerate-all" });

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  const rows = await db.select({ slug: articles.slug, title: articles.title, status: articles.status }).from(articles);

  logger.info({ total: rows.length }, "Starting bulk regeneration");

  let succeeded = 0;
  let failed = 0;

  for (const row of rows) {
    logger.info({ slug: row.slug, status: row.status }, "Regenerating");
    try {
      await regenerateEvergreenArticle(row.slug);
      succeeded++;
      logger.info({ slug: row.slug }, "Done");
    } catch (err) {
      failed++;
      logger.warn({ slug: row.slug, err: err instanceof Error ? err.message : err }, "Skipped");
    }
    // Throttle — avoid Anthropic rate limits
    await sleep(5000);
  }

  logger.info({ succeeded, failed }, "Bulk regeneration complete");
}

main().catch((err) => {
  logger.error(err, "Fatal error");
  process.exit(1);
});

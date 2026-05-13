/**
 * Embed a single article and upsert into page_embeddings.
 *
 * Called by:
 *  - Strategist services on every publish (after the quality gate
 *    passes, before persisting to articles table).
 *  - The one-time backfill script in scripts/backfill-link-graph.ts
 *    for existing articles.
 *
 * Embeds title + meta-description + first 500 chars of body. This
 * gives semantic signal for retrieval without burning tokens on full
 * 2-3k word bodies — empirically validated in the spec's design notes.
 */

import { db } from "@/lib/db";
import { pageEmbeddings } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { embedText } from "@/lib/openai";
import pino from "pino";

const logger = pino({ name: "embed-page" });

export type EmbedPageInput = {
  /** Canonical URL of the page (path with leading slash + domain or
   *  just the path — be consistent across the codebase). */
  url: string;
  /** FK back to articles.id when applicable; null for non-article
   *  pages (cluster hubs, tools, legal). */
  articleId?: number | null;
  pillar: string;
  cluster: string;
  language: "es" | "en";
  title: string;
  description: string;
  /** Full article body (markdown). First 500 chars get included in
   *  the embedded text. */
  content: string;
  isPillar?: boolean;
  isLeaf?: boolean;
};

/**
 * Upserts a page into page_embeddings with a fresh embedding. Returns
 * true on success, false when OPENAI_API_KEY is missing or the API
 * call fails — callers should not block their main flow on this.
 */
export async function embedPage(input: EmbedPageInput): Promise<boolean> {
  const text = `${input.title}\n\n${input.description}\n\n${input.content.slice(0, 500)}`;
  const embedding = await embedText(text);
  if (!embedding) {
    logger.debug({ url: input.url }, "Skipping embed (no key or API failure)");
    return false;
  }

  try {
    await db
      .insert(pageEmbeddings)
      .values({
        url: input.url,
        articleId: input.articleId ?? null,
        pillar: input.pillar,
        cluster: input.cluster,
        language: input.language,
        title: input.title,
        description: input.description,
        isPillar: input.isPillar ?? false,
        isLeaf: input.isLeaf ?? true,
        embedding,
      })
      .onConflictDoUpdate({
        target: pageEmbeddings.url,
        set: {
          articleId: input.articleId ?? null,
          pillar: input.pillar,
          cluster: input.cluster,
          language: input.language,
          title: input.title,
          description: input.description,
          isPillar: input.isPillar ?? false,
          isLeaf: input.isLeaf ?? true,
          embedding,
          lastIndexed: sql`NOW()`,
        },
      });
    return true;
  } catch (err) {
    logger.error({ err, url: input.url }, "Failed to upsert page embedding");
    return false;
  }
}

/**
 * Semantic-similarity related-pages selector.
 *
 * Per Internal Linking v2 spec §4.2: pull top-N pages by cosine
 * distance, then diversify (some same-cluster, at least one
 * cross-pillar bridge, rest by overall similarity).
 *
 * Returns 3-5 related pages. Used by:
 *  - The strategist at publish time (writes outbound links to
 *    link_graph + appends a <RelatedPages> marker to body).
 *  - The <RelatedPages> RSC at render time when the marker is hit.
 *  - The audit cron (orphan-source suggestion: pages that SHOULD
 *    link to a given orphan but currently don't).
 */

import { db } from "@/lib/db";
import { pageEmbeddings } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "compute-related-pages" });

export type RelatedPage = {
  url: string;
  pillar: string;
  cluster: string;
  title: string;
  description: string;
  similarity: number;
};

export type ComputeOptions = {
  /** Total related pages to return. Default 5. */
  limit?: number;
  /** Minimum same-cluster pages in the result. Default 2. */
  minSameCluster?: number;
  /** Maximum same-cluster pages in the result. Default 3. */
  maxSameCluster?: number;
  /** Source page language — only pages with the same language
   *  surface in the result (avoids awkward cross-language clicks). */
  language: "es" | "en";
};

/**
 * Returns the diversified list of related pages for sourceUrl.
 *
 * Throws if the source page has no embedding row. Callers that
 * encounter that should embed the source first (typical flow:
 * embedPage() then computeRelatedPages()).
 */
export async function computeRelatedPages(
  sourceUrl: string,
  options: ComputeOptions,
): Promise<RelatedPage[]> {
  const limit = options.limit ?? 5;
  const minSameCluster = options.minSameCluster ?? 2;
  const maxSameCluster = options.maxSameCluster ?? 3;

  const source = await db.query.pageEmbeddings.findFirst({
    where: eq(pageEmbeddings.url, sourceUrl),
  });
  if (!source || !source.embedding) {
    // No embedding yet (typical before the backfill runs, or when
    // OPENAI_API_KEY is missing). Return empty so the caller / RSC
    // can gracefully render nothing rather than crashing.
    logger.debug({ sourceUrl }, "computeRelatedPages: no source embedding, returning empty");
    return [];
  }

  // Top-30 by cosine similarity, same language only, recently indexed.
  // pgvector's `<=>` operator computes cosine DISTANCE; 1 - distance
  // gives the similarity score we surface.
  //
  // The codebase uses drizzle-orm/postgres-js — db.execute() returns
  // an array of rows directly (not wrapped in {rows: ...}).
  const sourceEmbedding = source.embedding;
  const rows = (await db.execute(sql`
    SELECT
      url, pillar, cluster, title, description,
      1 - (embedding <=> ${JSON.stringify(sourceEmbedding)}::vector) AS similarity
    FROM page_embeddings
    WHERE url != ${sourceUrl}
      AND language = ${options.language}
      AND last_indexed > NOW() - INTERVAL '90 days'
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${JSON.stringify(sourceEmbedding)}::vector
    LIMIT 30
  `)) as unknown as Array<{
    url: string;
    pillar: string;
    cluster: string;
    title: string;
    description: string;
    similarity: number | string;
  }>;

  const candidates: RelatedPage[] = rows.map((r) => ({
    url: r.url,
    pillar: r.pillar,
    cluster: r.cluster,
    title: r.title,
    description: r.description,
    similarity: Number(r.similarity),
  }));

  return diversify(candidates, source, {
    limit,
    minSameCluster,
    maxSameCluster,
  });
}

function diversify(
  candidates: RelatedPage[],
  source: { pillar: string; cluster: string },
  options: { limit: number; minSameCluster: number; maxSameCluster: number },
): RelatedPage[] {
  const sameCluster = candidates.filter(
    (c) => c.pillar === source.pillar && c.cluster === source.cluster,
  );
  const samePillarOtherCluster = candidates.filter(
    (c) => c.pillar === source.pillar && c.cluster !== source.cluster,
  );
  const crossPillar = candidates.filter((c) => c.pillar !== source.pillar);

  const result: RelatedPage[] = [];
  const seen = new Set<string>();
  const push = (page: RelatedPage): void => {
    if (seen.has(page.url)) return;
    if (result.length >= options.limit) return;
    seen.add(page.url);
    result.push(page);
  };

  // (1) minSameCluster from same cluster (most-similar first).
  for (const c of sameCluster.slice(0, options.minSameCluster)) push(c);

  // (2) At least one cross-pillar bridge for topical breadth.
  if (crossPillar.length > 0) push(crossPillar[0]);

  // (3) Fill remaining, respecting maxSameCluster.
  const filler = [
    ...sameCluster.slice(options.minSameCluster, options.maxSameCluster),
    ...samePillarOtherCluster,
    ...crossPillar.slice(1),
  ];
  for (const c of filler) push(c);

  return result;
}

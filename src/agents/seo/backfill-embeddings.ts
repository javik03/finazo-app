/**
 * One-off backfill: embed every published article into page_embeddings.
 *
 * Run on the writer-us-strategist container (has DATABASE_URL +
 * OPENAI_API_KEY in scope):
 *
 *   npx tsx src/agents/seo/backfill-embeddings.ts            # dry-run
 *   npx tsx src/agents/seo/backfill-embeddings.ts --apply    # commit
 *
 * Re-running with --apply on an article that's already embedded does
 * an upsert (lastIndexed bumps, embedding refreshes). Use this when
 * the embedding model changes or after large content rewrites.
 *
 * Cost: 57 articles × ~500 tokens × $0.02/M = $0.00057. Trivial.
 */

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { embedPage } from "@/lib/linker/embed-page";
import { CLUSTERS, type ClusterDefinition } from "@/lib/cluster-registry";
import pino from "pino";

const logger = pino({ name: "backfill-embeddings" });

/**
 * Map an article (by slug + category) to a (pillar, cluster) pair
 * using the same registry rules ClusterArticlesSection applies.
 * Pillar === cluster for now since the topical tree is flat.
 */
function clusterForArticle(slug: string, category: string): { pillar: string; cluster: string } {
  for (const [key, def] of Object.entries(CLUSTERS) as [string, ClusterDefinition][]) {
    if (def.dbCategories.length > 0 && !def.dbCategories.includes(category)) continue;
    if (def.slugIncludes && def.slugIncludes.length > 0
      && !def.slugIncludes.some((f) => slug.includes(f))) continue;
    if (def.slugExcludes && def.slugExcludes.length > 0
      && def.slugExcludes.some((f) => slug.includes(f))) continue;
    return { pillar: key, cluster: key };
  }
  return { pillar: category, cluster: category };
}

type RunOptions = { apply?: boolean; limit?: number };

export async function run(options: RunOptions = {}): Promise<void> {
  const apply = options.apply ?? false;
  const limit = options.limit ?? 200;

  const rows = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      title: articles.title,
      metaDescription: articles.metaDescription,
      category: articles.category,
      language: articles.language,
      content: articles.content,
    })
    .from(articles)
    .where(and(eq(articles.country, "US"), eq(articles.status, "published")))
    .limit(limit);

  logger.info({ total: rows.length, mode: apply ? "APPLY" : "DRY-RUN" }, "Backfill starting");

  let ok = 0;
  let fail = 0;

  for (const row of rows) {
    const url = `https://finazo.us/guias/${row.slug}`;
    const { pillar, cluster } = clusterForArticle(row.slug, row.category);
    const language = (row.language ?? "es") as "es" | "en";

    if (!apply) {
      console.log(`[DRY] ${row.slug} → cluster=${cluster} lang=${language}`);
      ok += 1;
      continue;
    }

    const success = await embedPage({
      url,
      articleId: typeof row.id === "string" ? null : (row.id as number),
      pillar,
      cluster,
      language,
      title: row.title,
      description: row.metaDescription ?? row.title,
      content: row.content,
      isPillar: false,
      isLeaf: true,
    });

    if (success) {
      console.log(`[OK]  ${row.slug}`);
      ok += 1;
    } else {
      console.log(`[ERR] ${row.slug} — embedPage returned false`);
      fail += 1;
    }

    // Gentle rate-limit so we don't trip OpenAI per-second limits.
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(
    `\nDone: ${ok} ${apply ? "embedded" : "would embed"}, ${fail} failed.`,
  );
}

function parseArgs(): RunOptions {
  const opts: RunOptions = {};
  for (const arg of process.argv.slice(2)) {
    if (arg === "--apply") opts.apply = true;
    if (arg.startsWith("--limit=")) opts.limit = Number(arg.slice("--limit=".length));
  }
  return opts;
}

if (require.main === module) {
  run(parseArgs()).catch((err: unknown) => {
    logger.error({ err }, "Backfill failed");
    process.exit(1);
  });
}

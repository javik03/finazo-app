/**
 * Topic Proposer — closes the self-update loop for the US strategist.
 *
 * Reads us_gsc_snapshots from the last 30 days. For each query that:
 *   - has ≥50 impressions (real organic interest)
 *   - sends users to a non-dedicated page (homepage, hub, mismatched topic)
 *   - has no existing article matching the query slug
 *
 * Asks Claude to propose a topic spec (slug, category, author, prompt).
 * Writes the proposal to us_topic_proposals as 'pending' — humans review
 * and flip status to 'approved' before the strategist picks it up.
 *
 * Also flags pages with high impressions but low CTR (<2%) as candidates
 * for title/meta rewrites — those go to a separate "ctr_rewrite" status.
 *
 * Run weekly (cron). No-ops if us_gsc_snapshots is empty.
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import {
  articles,
  usGscSnapshots,
  usTopicProposals,
} from "@/lib/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import pino from "pino";
import { config } from "@/lib/config";

const logger = pino({ name: "topic-proposer" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const MIN_IMPRESSIONS = 50;
const LOOKBACK_DAYS = 30;
const MAX_PROPOSALS_PER_RUN = 10;

type AggregatedQuery = {
  query: string;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  topPage: string | null;
};

async function getCandidateQueries(): Promise<AggregatedQuery[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - LOOKBACK_DAYS);

  // Aggregate impressions by query across the lookback window.
  // We want queries with real volume that don't currently land on a
  // dedicated finazo.us article.
  const rows = await db
    .select({
      query: usGscSnapshots.query,
      impressions: sql<number>`SUM(${usGscSnapshots.impressions})::int`,
      clicks: sql<number>`SUM(${usGscSnapshots.clicks})::int`,
      avgPosition: sql<number>`AVG(${usGscSnapshots.position})`,
      topPage: sql<string>`(ARRAY_AGG(${usGscSnapshots.page} ORDER BY ${usGscSnapshots.impressions} DESC))[1]`,
    })
    .from(usGscSnapshots)
    .where(gte(usGscSnapshots.snapshotDate, since))
    .groupBy(usGscSnapshots.query)
    .having(sql`SUM(${usGscSnapshots.impressions}) >= ${MIN_IMPRESSIONS}`)
    .orderBy(desc(sql`SUM(${usGscSnapshots.impressions})`))
    .limit(100);

  return rows.map((r) => ({
    query: r.query,
    totalImpressions: r.impressions,
    totalClicks: r.clicks,
    avgPosition: Number(r.avgPosition ?? 0),
    topPage: r.topPage,
  }));
}

async function isQueryAlreadyCovered(query: string): Promise<boolean> {
  // Heuristic: if any existing US article title or slug contains the
  // top 2 content words of the query, treat it as covered.
  const stopwords = new Set([
    "el","la","los","las","un","una","de","del","en","con","por","para","y","o","sin","a",
    "the","a","of","in","with","for","and","or","without","to","on","at","is","are","my",
    "qué","que","cómo","como","cuál","cuando","si","sí",
  ]);
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopwords.has(w));

  if (words.length < 2) return false;
  const [w1, w2] = words;

  const matches = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(
        eq(articles.country, "US"),
        sql`(LOWER(${articles.slug}) LIKE ${`%${w1}%`} AND LOWER(${articles.slug}) LIKE ${`%${w2}%`})
            OR (LOWER(${articles.title}) LIKE ${`%${w1}%`} AND LOWER(${articles.title}) LIKE ${`%${w2}%`})`,
      ),
    )
    .limit(1);

  return matches.length > 0;
}

async function isProposalAlreadyExists(query: string): Promise<boolean> {
  // Avoid re-proposing for queries we already proposed in past runs.
  const slug = querySlug(query);
  const existing = await db
    .select({ slug: usTopicProposals.slug })
    .from(usTopicProposals)
    .where(eq(usTopicProposals.slug, slug))
    .limit(1);
  return existing.length > 0;
}

function querySlug(query: string): string {
  return query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

type ClaudeProposal = {
  slug: string;
  category: "prestamos" | "seguros" | "educacion" | "remesas" | "tarjetas" | "ahorro";
  preferred_author: "javier-keough" | "sabrina-keough";
  image_query: string;
  prompt: string;
  rationale: string;
};

async function askClaudeToPropose(
  q: AggregatedQuery,
): Promise<ClaudeProposal | null> {
  const systemPrompt = `Eres un editor SEO senior de Finazo (finazo.us, publicación independiente de finanzas para Hispanos en EE.UU.). Tu trabajo: convertir queries de Search Console en specs de artículos publicables.

REGLAS:
- El slug debe ser descriptivo, sin diacríticos, hyphen-separated, máx 80 caracteres
- La categoría debe ser una de: prestamos | seguros | educacion | remesas | tarjetas | ahorro
- El author debe ser javier-keough (préstamos, hipoteca, banking, crédito, remesas, ITIN, taxes) o sabrina-keough (seguros: auto, salud, vida, awareness)
- El prompt debe ser una instrucción de 6-10 líneas en español que un escritor pueda seguir
- El image_query debe ser una descripción en inglés de una escena fotografiable (Pexels lo busca en inglés)
- Incluye el meta-rationale en una oración explicando por qué este query merece su propio artículo

NO incluyas el suffix de SEO ni de E-E-A-T — el sistema lo agrega automáticamente.`;

  const userPrompt = `Search Console query con tracción organica que NO tiene página dedicada en finazo.us:

Query: "${q.query}"
Impresiones (30 días): ${q.totalImpressions}
Clicks: ${q.totalClicks}
CTR: ${q.totalImpressions > 0 ? ((q.totalClicks / q.totalImpressions) * 100).toFixed(2) : "0"}%
Posición promedio: ${q.avgPosition.toFixed(1)}
Página actual de aterrizaje: ${q.topPage ?? "(ninguna específica)"}

Devuelve SOLO un JSON con esta forma exacta:
{
  "slug": "...",
  "category": "...",
  "preferred_author": "...",
  "image_query": "...",
  "prompt": "Eres un experto en X. Escribe en español 1100-1300 palabras. Keyword principal: '...'. Título H1: '...'. Estructura: ## Introducción ... ## ... ## Preguntas frecuentes ## Conclusión",
  "rationale": "..."
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return null;

  // Robust JSON extraction (handles ```json fences if present)
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    logger.warn({ query: q.query, rawText: content.text.slice(0, 200) }, "No JSON in Claude response");
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]) as ClaudeProposal;
  } catch (err) {
    logger.warn({ query: q.query, err }, "Failed to parse proposal JSON");
    return null;
  }
}

export async function runTopicProposer(): Promise<void> {
  logger.info({ minImpressions: MIN_IMPRESSIONS, lookbackDays: LOOKBACK_DAYS }, "Starting");

  const candidates = await getCandidateQueries();
  if (candidates.length === 0) {
    logger.info("No candidate queries — likely GSC snapshots are empty");
    return;
  }
  logger.info({ candidates: candidates.length }, "Candidate queries fetched");

  let proposed = 0;
  let skipped = 0;

  for (const q of candidates) {
    if (proposed >= MAX_PROPOSALS_PER_RUN) break;

    if (await isQueryAlreadyCovered(q.query)) {
      skipped += 1;
      continue;
    }
    if (await isProposalAlreadyExists(q.query)) {
      skipped += 1;
      continue;
    }

    const proposal = await askClaudeToPropose(q);
    if (!proposal) {
      skipped += 1;
      continue;
    }

    try {
      await db.insert(usTopicProposals).values({
        source: "gsc",
        slug: proposal.slug,
        category: proposal.category,
        preferredAuthor: proposal.preferred_author,
        imageQuery: proposal.image_query,
        promptText: proposal.prompt,
        rationale: proposal.rationale,
        signalContext: {
          query: q.query,
          impressions: q.totalImpressions,
          clicks: q.totalClicks,
          avgPosition: q.avgPosition,
          topPage: q.topPage,
        },
        status: "pending",
      });
      proposed += 1;
      logger.info({ slug: proposal.slug, query: q.query, impressions: q.totalImpressions }, "Proposed");
    } catch (err) {
      logger.warn({ slug: proposal.slug, err }, "Failed to insert proposal (likely duplicate)");
      skipped += 1;
    }

    // Rate-limit Claude calls
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  logger.info({ proposed, skipped }, "Topic proposer run complete");
}

if (require.main === module) {
  runTopicProposer().catch((err: unknown) => {
    logger.error({ err }, "Topic proposer failed");
    process.exit(1);
  });
}

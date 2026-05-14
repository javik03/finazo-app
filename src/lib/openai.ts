/**
 * Minimal OpenAI client wrapper for the embeddings endpoint.
 *
 * Used by the Internal Linking v2 linker (page_embeddings table,
 * semantic-similarity related-pages, audit cron). Calls `text-
 * embedding-3-small` (768-dim, ~$0.02 per million tokens).
 *
 * Not a general-purpose OpenAI SDK — only what we use today. Wrap in
 * tenacity-equivalent retry if the rate-limit becomes a problem at
 * higher article-publish throughput.
 */

import { config } from "@/lib/config";
import pino from "pino";

const logger = pino({ name: "openai" });

interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  usage?: { total_tokens: number };
}

const ENDPOINT = "https://api.openai.com/v1/embeddings";
const MODEL = "text-embedding-3-small";
const DIMENSIONS = 768;

/**
 * Returns a 768-dim embedding for the given text. Returns null when
 * OPENAI_API_KEY is unset — caller decides whether to skip the embed
 * step gracefully (typical) or hard-fail.
 *
 * The text-embedding-3-small model defaults to 1536 dimensions; we
 * pass the `dimensions: 768` parameter so the response matches the
 * page_embeddings column. Truncation is done OpenAI-side via
 * Matryoshka-style projection — quality drop vs 1536 is small for
 * our retrieval use case.
 */
export async function embedText(text: string): Promise<number[] | null> {
  if (!config.OPENAI_API_KEY) {
    logger.warn("OPENAI_API_KEY not set — skipping embedding");
    return null;
  }
  if (!text || text.trim().length === 0) {
    return null;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        input: text,
        dimensions: DIMENSIONS,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.warn(
        { status: res.status, body: body.slice(0, 200) },
        "OpenAI embeddings non-200",
      );
      return null;
    }

    const data = (await res.json()) as EmbeddingResponse;
    const embedding = data.data[0]?.embedding;
    if (!embedding || embedding.length !== DIMENSIONS) {
      logger.warn({ got: embedding?.length }, "Unexpected embedding shape");
      return null;
    }
    return embedding;
  } catch (err) {
    logger.error({ err }, "OpenAI embeddings request failed");
    return null;
  }
}

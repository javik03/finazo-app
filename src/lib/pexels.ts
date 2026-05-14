import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { isNotNull } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "pexels" });

interface PexelsPhoto {
  id: number;
  src: {
    landscape: string;
    large2x: string;
    large: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

export interface FetchOptions {
  /** Photo IDs to exclude (already used elsewhere). When supplied, the
   *  resolver returns the first candidate from the top-30 results whose
   *  ID is not in this set. Prevents the original duplication bug where
   *  per_page=1 returned the same top photo for every similar query. */
  exclude?: Iterable<number>;
}

/**
 * Fetch a relevant featured image from Pexels for an article.
 * Returns the landscape URL (1200×627) or null if unavailable.
 *
 * Pulls top-30 candidates and picks the first photo whose ID is not in
 * `options.exclude` (when provided). If every candidate is excluded,
 * falls back to the top result rather than returning null — better a
 * duplicate than a missing hero.
 */
export async function fetchFeaturedImage(
  query: string,
  options: FetchOptions = {},
): Promise<string | null> {
  if (!config.PEXELS_API_KEY) {
    logger.debug("PEXELS_API_KEY not set — skipping image fetch");
    return null;
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: config.PEXELS_API_KEY },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      logger.warn({ status: res.status, query }, "Pexels API returned non-OK status");
      return null;
    }

    const data: PexelsResponse = await res.json() as PexelsResponse;
    if (data.photos.length === 0) return null;

    const excludeSet = new Set<number>(options.exclude ?? []);
    for (const photo of data.photos) {
      if (!excludeSet.has(photo.id)) return photo.src.landscape;
    }

    // All 30 candidates already used. Accept the duplicate rather than
    // shipping an imageless article.
    logger.warn(
      { query, excludeCount: excludeSet.size },
      "All Pexels candidates already used — falling back to top result",
    );
    return data.photos[0].src.landscape;
  } catch (err) {
    logger.error({ err, query }, "Failed to fetch image from Pexels");
    return null;
  }
}

/**
 * Returns the set of Pexels photo IDs currently in use by any
 * published article's featured_image_url. Pass the result to
 * `fetchFeaturedImage(query, { exclude })` so the next generated
 * article doesn't re-duplicate an existing hero.
 */
export async function getCurrentlyUsedImageIds(): Promise<Set<number>> {
  const rows = await db
    .select({ featuredImageUrl: articles.featuredImageUrl })
    .from(articles)
    .where(isNotNull(articles.featuredImageUrl));

  const ids = new Set<number>();
  for (const r of rows) {
    if (!r.featuredImageUrl) continue;
    const match = r.featuredImageUrl.match(/pexels-photo-(\d+)/);
    if (match) ids.add(Number(match[1]));
  }
  return ids;
}

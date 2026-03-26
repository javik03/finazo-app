import { config } from "@/lib/config";
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

/**
 * Fetch a relevant featured image from Pexels for an article.
 * Returns the landscape URL (1200×627) or null if unavailable.
 */
export async function fetchFeaturedImage(query: string): Promise<string | null> {
  if (!config.PEXELS_API_KEY) {
    logger.debug("PEXELS_API_KEY not set — skipping image fetch");
    return null;
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: config.PEXELS_API_KEY },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      logger.warn({ status: res.status, query }, "Pexels API returned non-OK status");
      return null;
    }

    const data: PexelsResponse = await res.json() as PexelsResponse;
    const photo = data.photos[0];
    if (!photo) return null;

    return photo.src.landscape;
  } catch (err) {
    logger.error({ err, query }, "Failed to fetch image from Pexels");
    return null;
  }
}

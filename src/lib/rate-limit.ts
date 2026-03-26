/**
 * IP-based rate limiter using Upstash Redis.
 * Falls back to allowing requests if UPSTASH env vars are not configured
 * (so the app doesn't break during local development or before Upstash is set up).
 *
 * Usage:
 *   const { success, limit, remaining } = await rateLimit(ip, "comments");
 *   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import pino from "pino";

const logger = pino({ name: "rate-limit" });

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // unix timestamp in seconds
};

// Lazily initialised so the module can be imported without crashing when
// UPSTASH vars are absent (e.g. during build or tests).
let ratelimiter: Ratelimit | null = null;

function getOrCreateLimiter(): Ratelimit | null {
  if (ratelimiter) return ratelimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    logger.warn("UPSTASH_REDIS_REST_URL / TOKEN not set — rate limiting disabled");
    return null;
  }

  ratelimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    // Sliding window: 5 POST requests per IP per 60 seconds
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "finazo:rl",
    analytics: false,
  });

  return ratelimiter;
}

/**
 * Check rate limit for a given identifier (typically the client IP).
 * Returns { success: true } if request should be allowed.
 */
export async function rateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getOrCreateLimiter();

  if (!limiter) {
    // Upstash not configured — pass all requests through
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: Math.floor(result.reset / 1000),
  };
}

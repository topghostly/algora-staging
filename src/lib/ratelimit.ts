import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Simple in-memory cache for fallback
const memoryCache = new Map<string, number[]>();

export async function rateLimit(identifier: string) {
  // Disable rate limiting in test environment to avoid false positives in E2E tests
  if (process.env.NODE_ENV === "test" || process.env.DISABLE_RATE_LIMIT === "true") {
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 10000 };
  }

  // Check if Upstash credentials are configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
      analytics: true,
    });

    return await ratelimit.limit(identifier);
  }

  // Fallback: In-memory rate limiting (Token Bucket-ish)
  // Allow 10 requests per 10 seconds
  const now = Date.now();
  const windowStart = now - 10000;

  const timestamps = memoryCache.get(identifier) || [];
  const recentTimestamps = timestamps.filter((t) => t > windowStart);

  if (recentTimestamps.length >= 10) {
    return {
      success: false,
      limit: 10,
      remaining: 0,
      reset: recentTimestamps[0] + 10000,
    };
  }

  recentTimestamps.push(now);
  memoryCache.set(identifier, recentTimestamps);

  return {
    success: true,
    limit: 10,
    remaining: 10 - recentTimestamps.length,
    reset: now + 10000,
  };
}

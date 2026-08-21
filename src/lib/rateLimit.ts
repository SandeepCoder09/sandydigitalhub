/**
 * Lightweight In-Memory Rate Limiter
 * Protects endpoints from burst requests, brute force, and scraping overload.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit?: number;        // Maximum requests allowed within window (default: 60)
  windowSeconds?: number; // Time window in seconds (default: 60)
}

/**
 * Checks rate limit for a given identifier (e.g. client IP or User ID)
 * Returns { success: boolean, remaining: number, reset: number }
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; reset: number } {
  const limit = options.limit ?? 60;
  const windowMs = (options.windowSeconds ?? 60) * 1000;
  const now = Date.now();

  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}

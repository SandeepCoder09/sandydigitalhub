/**
 * Enhanced Rate Limiter & Progressive Login Lockout Utility
 * Protects endpoints from burst requests, brute force, and credential stuffing.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface LoginAttemptRecord {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const loginAttemptStore = new Map<string, LoginAttemptRecord>();

export interface RateLimitOptions {
  limit?: number; // Maximum requests allowed within window (default: 60)
  windowSeconds?: number; // Time window in seconds (default: 60)
}

/**
 * Extracts client IP safely from request headers or socket info.
 */
export function getClientIp(req: Request | Headers | any): string {
  let headers: Headers;
  if (req instanceof Request) {
    headers = req.headers;
  } else if (req && typeof req.get === 'function') {
    // NextRequest or custom request object
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    const xri = req.headers.get('x-real-ip');
    if (xri) return xri.trim();
    return '127.0.0.1';
  } else if (req && typeof req.entries === 'function') {
    headers = req;
  } else {
    return '127.0.0.1';
  }

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return '127.0.0.1';
}

/**
 * General-purpose rate limiter for API endpoints
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

/**
 * Progressive Login Attempt Rate Limiter:
 * - 5 failed attempts in 5 min -> 5 min lockout
 * - 10 failed attempts in 15 min -> 15 min lockout
 */
export function checkLoginAttempts(identifier: string): {
  allowed: boolean;
  lockedUntilSeconds?: number;
  remainingAttempts: number;
} {
  const record = loginAttemptStore.get(identifier.toLowerCase().trim());
  const now = Date.now();

  if (!record) {
    return { allowed: true, remainingAttempts: 5 };
  }

  // If locked, check if lockout duration has passed
  if (record.lockedUntil && now < record.lockedUntil) {
    const lockedUntilSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      lockedUntilSeconds,
      remainingAttempts: 0,
    };
  }

  // If 15 minutes have passed since last attempt, reset record
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    loginAttemptStore.delete(identifier.toLowerCase().trim());
    return { allowed: true, remainingAttempts: 5 };
  }

  const remaining = Math.max(0, 5 - record.attempts);
  return { allowed: true, remainingAttempts: remaining };
}

/**
 * Records a failed login attempt for an identifier (e.g. email or IP)
 */
export function recordFailedLogin(identifier: string): { locked: boolean; lockTimeSeconds?: number } {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttemptStore.get(key) || { attempts: 0, lockedUntil: null, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  // Progressive lockout triggers
  if (record.attempts >= 10) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
    loginAttemptStore.set(key, record);
    return { locked: true, lockTimeSeconds: 15 * 60 };
  } else if (record.attempts >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000; // 5-minute lock
    loginAttemptStore.set(key, record);
    return { locked: true, lockTimeSeconds: 5 * 60 };
  }

  loginAttemptStore.set(key, record);
  return { locked: false };
}

/**
 * Clears failed login counter on successful authentication
 */
export function resetLoginAttempts(identifier: string): void {
  loginAttemptStore.delete(identifier.toLowerCase().trim());
}

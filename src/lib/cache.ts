/**
 * In-memory TTL & Multi-Tenant Cache Utility
 * Drastically reduces database queries, eliminates duplicate requests, and enforces tenant isolation.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
  staleWhileRevalidateUntil?: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private inFlightRequests = new Map<string, Promise<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Constructs a secure, isolated cache key preventing cross-tenant and cross-user leaks.
   */
  buildKey(
    prefix: string,
    options: {
      tenantId?: string;
      userId?: string;
      role?: string;
      params?: Record<string, any>;
    } = {}
  ): string {
    const parts = [prefix];
    if (options.tenantId) parts.push(`tenant:${options.tenantId}`);
    if (options.userId) parts.push(`user:${options.userId}`);
    if (options.role) parts.push(`role:${options.role}`);

    if (options.params && Object.keys(options.params).length > 0) {
      const sortedKeys = Object.keys(options.params).sort();
      const paramStr = sortedKeys
        .map((k) => `${k}=${String(options.params![k])}`)
        .join('&');
      parts.push(`params:${paramStr}`);
    }

    return parts.join('::');
  }

  /**
   * Request Deduplication & SWR:
   * Returns cached item, or reuses in-flight promise if identical request is pending.
   */
  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>,
    swrSeconds: number = 0
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Reuse existing in-flight promise if available
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        const freshData = await fetcher();
        this.set(key, freshData, ttlSeconds, swrSeconds);
        return freshData;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, promise);
    return promise;
  }

  /**
   * Retrieve item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      // Check if within SWR window
      if (entry.staleWhileRevalidateUntil && Date.now() <= entry.staleWhileRevalidateUntil) {
        return entry.data as T;
      }
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set item in cache with TTL and optional Stale-While-Revalidate window
   */
  set<T>(key: string, data: T, ttlSeconds: number = 60, swrSeconds: number = 0): void {
    const now = Date.now();
    this.store.set(key, {
      data,
      expiry: now + ttlSeconds * 1000,
      staleWhileRevalidateUntil: swrSeconds > 0 ? now + (ttlSeconds + swrSeconds) * 1000 : undefined,
    });
  }

  /**
   * Invalidate specific key or keys starting with a prefix
   */
  invalidate(keyOrPrefix: string): void {
    for (const key of this.store.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Invalidate all service catalog caches
   */
  invalidateServices(): void {
    this.invalidate('services');
  }

  /**
   * Invalidate partner caches
   */
  invalidatePartners(partnerId?: string): void {
    if (partnerId) {
      this.invalidate(`partner::tenant:${partnerId}`);
      this.invalidate(`partner-centers`);
    } else {
      this.invalidate('partner');
      this.invalidate('partner-centers');
    }
  }

  /**
   * Invalidate notifications
   */
  invalidateNotifications(userId?: string, tenantId?: string): void {
    this.invalidate('notifications');
    if (userId) this.invalidate(`notifications::user:${userId}`);
    if (tenantId) this.invalidate(`notifications::tenant:${tenantId}`);
  }

  /**
   * Invalidate reviews cache
   */
  invalidateReviews(): void {
    this.invalidate('reviews');
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.store.clear();
    this.inFlightRequests.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      const maxExpiry = entry.staleWhileRevalidateUntil || entry.expiry;
      if (now > maxExpiry) {
        this.store.delete(key);
      }
    }
  }
}

// Global singleton instance across serverless/Node.js invocations
const globalForCache = global as unknown as { serverCache: MemoryCache };
export const cache = globalForCache.serverCache || new MemoryCache();
if (process.env.NODE_ENV !== 'production') globalForCache.serverCache = cache;

export default cache;

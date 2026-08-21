/**
 * In-memory TTL (Time-To-Live) Cache Utility
 * Drastically reduces database queries and server workload under heavy traffic.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodic garbage collection every 5 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Get cached item or execute fallback fetcher if missing/expired
   * @param key Unique cache key
   * @param ttlSeconds Time to live in seconds (default: 60s)
   * @param fetcher Async function to fetch fresh data if cache missed
   */
  async getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const freshData = await fetcher();
    this.set(key, freshData, ttlSeconds);
    return freshData;
  }

  /**
   * Retrieve item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set item in cache with TTL
   */
  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    this.store.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
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
   * Clear entire cache
   */
  clear(): void {
    this.store.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
      }
    }
  }
}

// Global singleton instance across warm serverless/Node.js invocations
const globalForCache = global as unknown as { serverCache: MemoryCache };
export const cache = globalForCache.serverCache || new MemoryCache();
if (process.env.NODE_ENV !== 'production') globalForCache.serverCache = cache;

export default cache;

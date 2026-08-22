/**
 * Client-Side Request Deduplication & SWR Caching
 * 
 * Prevents multiple components from firing identical API requests concurrently.
 * Shares in-flight Promises and maintains short-lived client caches.
 */

interface ClientCacheEntry<T> {
  data: T;
  expiry: number;
}

const clientCache = new Map<string, ClientCacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

export interface ClientFetchOptions extends RequestInit {
  cacheTtlMs?: number; // Duration to cache in browser memory (default: 10000ms for GET)
  dedupe?: boolean;    // Coalesce in-flight requests (default: true)
}

/**
 * Deduplicated fetch wrapper for client components.
 */
export async function clientFetch<T = any>(
  url: string,
  options: ClientFetchOptions = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const cacheTtlMs = options.cacheTtlMs ?? (method === 'GET' ? 10000 : 0);
  const dedupe = options.dedupe ?? true;

  // Only GET requests are cached and deduplicated
  if (method === 'GET') {
    const cached = clientCache.get(url);
    if (cached && Date.now() < cached.expiry) {
      return cached.data as T;
    }

    if (dedupe && inFlightRequests.has(url)) {
      return inFlightRequests.get(url) as Promise<T>;
    }
  }

  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      if (method === 'GET' && cacheTtlMs > 0) {
        clientCache.set(url, {
          data,
          expiry: Date.now() + cacheTtlMs,
        });
      }

      return data as T;
    } finally {
      if (method === 'GET') {
        inFlightRequests.delete(url);
      }
    }
  })();

  if (method === 'GET' && dedupe) {
    inFlightRequests.set(url, promise);
  }

  return promise;
}

/**
 * Invalidate client cache by URL or prefix
 */
export function invalidateClientCache(urlOrPrefix?: string): void {
  if (!urlOrPrefix) {
    clientCache.clear();
    return;
  }
  for (const key of clientCache.keys()) {
    if (key === urlOrPrefix || key.startsWith(urlOrPrefix)) {
      clientCache.delete(key);
    }
  }
}

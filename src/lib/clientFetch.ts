import { buildApiUrl } from '@/lib/apiClient';

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
 * Deduplicated fetch wrapper for client components with cross-domain support.
 */
export async function clientFetch<T = any>(
  endpointOrUrl: string,
  options: ClientFetchOptions = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const cacheTtlMs = options.cacheTtlMs ?? (method === 'GET' ? 10000 : 0);
  const dedupe = options.dedupe ?? true;
  const fullUrl = buildApiUrl(endpointOrUrl);

  // Only GET requests are cached and deduplicated
  if (method === 'GET') {
    const cached = clientCache.get(fullUrl);
    if (cached && Date.now() < cached.expiry) {
      return cached.data as T;
    }

    if (dedupe && inFlightRequests.has(fullUrl)) {
      return inFlightRequests.get(fullUrl) as Promise<T>;
    }
  }

  const promise = (async () => {
    try {
      const fetchOptions: RequestInit = {
        credentials: 'include',
        ...options,
      };
      const res = await fetch(fullUrl, fetchOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      if (method === 'GET' && cacheTtlMs > 0) {
        clientCache.set(fullUrl, {
          data,
          expiry: Date.now() + cacheTtlMs,
        });
      }

      return data as T;
    } finally {
      if (method === 'GET') {
        inFlightRequests.delete(fullUrl);
      }
    }
  })();

  if (method === 'GET' && dedupe) {
    inFlightRequests.set(fullUrl, promise);
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

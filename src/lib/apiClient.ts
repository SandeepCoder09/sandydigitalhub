/**
 * Centralized API Client
 * 
 * Supports both unified Next.js deployment and decoupled architecture
 * (e.g. Frontend on Vercel, Backend API on Render).
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Builds full URL based on relative endpoint and optional query params.
 */
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If endpoint is already a relative /api route or full URL, format appropriately
  const base = API_BASE_URL ? `${API_BASE_URL}${normalizedEndpoint}` : normalizedEndpoint;
  
  if (!params) return base;

  const url = new URL(base, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}

/**
 * Universal API Request Wrapper with credentials and CORS support
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { params, headers, ...customOptions } = options;
  const url = buildApiUrl(endpoint, params);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config: RequestInit = {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    // Cross-Origin credentials for Vercel -> Render cross-domain session cookies
    credentials: 'include',
    ...customOptions,
  };

  try {
    const res = await fetch(url, config);

    // Handle 204 No Content
    if (res.status === 204) {
      return null as unknown as T;
    }

    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errorMessage =
        (typeof data === 'object' && (data.message || data.error)) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(errorMessage, res.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network connection failed', 500);
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: ApiClientOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: ApiClientOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: ApiClientOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: ApiClientOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: ApiClientOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

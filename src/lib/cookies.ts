/**
 * Cookie Management & Performance Optimization Utility
 * Use cookies for caching user preferences, guest state, and reducing server roundtrips.
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;
}

export const COOKIE_KEYS = {
  SESSION_TOKEN: 'next-auth.session-token',
  SECURE_SESSION_TOKEN: '__Secure-next-auth.session-token',
  THEME_PREFERENCE: 'sdh_theme',
  TENANT_SELECTION: 'sdh_tenant',
  VISITOR_ID: 'sdh_vid',
  RECENT_SEARCHES: 'sdh_recent_searches',
  COOKIE_CONSENT: 'sdh_cookie_consent',
} as const;

/**
 * Client-Side Cookie Helpers
 */
export const clientCookies = {
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    }
    return null;
  },

  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return;
    const { days = 30, path = '/', secure = process.env.NODE_ENV === 'production', sameSite = 'Lax' } = options;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=${sameSite}${
      secure ? '; Secure' : ''
    }`;
  },

  delete(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  },

  getJSON<T>(name: string): T | null {
    const val = this.get(name);
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return null;
    }
  },

  setJSON<T>(name: string, value: T, options?: CookieOptions): void {
    this.set(name, JSON.stringify(value), options);
  },
};

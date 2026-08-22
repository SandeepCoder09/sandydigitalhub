import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEYS } from '@/lib/cookies';

// Allowed origins for CORS (Vercel Frontend -> Render Backend)
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://sandydigitalhub.vercel.app',
  'https://sandycoder.vercel.app',
];

function getAllowedOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;

  const envOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const frontendUrl = process.env.FRONTEND_URL?.trim();
  const allAllowed = [...DEFAULT_ALLOWED_ORIGINS, ...envOrigins];
  if (frontendUrl) allAllowed.push(frontendUrl);

  // Exact match or vercel deployment match
  if (
    allAllowed.includes(requestOrigin) ||
    requestOrigin.endsWith('.vercel.app')
  ) {
    return requestOrigin;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigin = getAllowedOrigin(origin);
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // 1. Handle CORS preflight OPTIONS requests for API routes
  if (isApiRoute && request.method === 'OPTIONS') {
    const preflightHeaders = new Headers();
    if (allowedOrigin) {
      preflightHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
      preflightHeaders.set('Access-Control-Allow-Credentials', 'true');
    }
    preflightHeaders.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    preflightHeaders.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Sentry-Trace, Baggage'
    );
    preflightHeaders.set('Access-Control-Max-Age', '86400'); // 24 hours

    return new NextResponse(null, { status: 204, headers: preflightHeaders });
  }

  // 2. NextAuth cookie check
  const token =
    request.cookies.get(COOKIE_KEYS.SESSION_TOKEN)?.value ||
    request.cookies.get(COOKIE_KEYS.SECURE_SESSION_TOKEN)?.value;
  const path = request.nextUrl.pathname;

  // Protect account, requests, profile, and admin routes
  if (
    path.startsWith('/account') ||
    path.startsWith('/requests') ||
    path.startsWith('/profile') ||
    path.startsWith('/admin')
  ) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged in users from seeing login/signup
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  const response = NextResponse.next();

  // 3. Attach CORS headers to API responses
  if (isApiRoute && allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
  }

  // 4. Enforce HTTP Security Headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

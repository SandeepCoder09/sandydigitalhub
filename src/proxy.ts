import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEYS } from '@/lib/cookies';

export function proxy(request: NextRequest) {
  // NextAuth uses 'next-auth.session-token' in dev, '__Secure-next-auth.session-token' in production
  const token = request.cookies.get(COOKIE_KEYS.SESSION_TOKEN)?.value
    || request.cookies.get(COOKIE_KEYS.SECURE_SESSION_TOKEN)?.value;
  const path = request.nextUrl.pathname;

  // Protect account, requests, profile, and admin routes
  if (path.startsWith('/account') || path.startsWith('/requests') || path.startsWith('/profile') || path.startsWith('/admin')) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account',
    '/account/:path*',
    '/requests',
    '/requests/:path*',
    '/profile',
    '/profile/:path*',
    '/admin',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};

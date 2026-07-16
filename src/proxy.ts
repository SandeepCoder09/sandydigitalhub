import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // NextAuth uses 'next-auth.session-token' in dev, '__Secure-next-auth.session-token' in production
  const token = request.cookies.get('next-auth.session-token')?.value
    || request.cookies.get('__Secure-next-auth.session-token')?.value;
  const path = request.nextUrl.pathname;

  // Protect profile routes
  if (path.startsWith('/profile') || path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged in users from seeing login/signup
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/login', '/signup'],
};

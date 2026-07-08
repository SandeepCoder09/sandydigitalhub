import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  // Protect dashboard routes
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Note: To fully secure /admin, we'd need to verify the token role, 
    // but JWT verification in edge middleware requires jose instead of jsonwebtoken.
    // For Phase 1, we just check existence and verify role in page/layout components.
  }

  // Prevent logged in users from seeing login/signup
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};

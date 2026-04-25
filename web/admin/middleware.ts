import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the Edge. firebase-admin is NOT available here.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin and api routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    const session = request.cookies.get('session')?.value;

    // Basic check: if no session cookie, redirect to login (if we had one) 
    // or return unauthorized for API
    if (!session) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // In a real app, redirect to /login
      // return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};

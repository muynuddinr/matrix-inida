import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware runs on server-side, cannot access localStorage
  // All authentication checks are done on client-side
  // Just allow requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

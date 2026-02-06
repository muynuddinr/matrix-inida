import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next();

  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        persistSession: false,
      },
    }
  );

  // Get the session from cookies
  const token = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;

  let session = null;

  if (token && refreshToken) {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken,
      });

      if (!error && data.session) {
        session = data.session;
      }
    } catch (error) {
      console.error('Session validation error:', error);
    }
  }

  // If user is not authenticated and trying to access admin routes (except login)
  if (!session && req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (session && req.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
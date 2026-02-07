import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Get credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set an HttpOnly cookie so middleware can detect authenticated admin sessions
      const res = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          email: ADMIN_EMAIL,
          role: 'admin'
        }
      });

      // In production, set secure flag for cookies
      const cookieOptions: any = {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

      res.cookies.set('admin_logged_in', 'true', cookieOptions);
      return res;
    } else {
      // Invalid credentials
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for checking login status)
export async function GET(request: NextRequest) {
  try {
    // This could be used to check if user is logged in
    // For now, just return a simple response
    return NextResponse.json({
      message: 'Login API is running',
      status: 'ok'
    });
  } catch (error) {
    console.error('Login API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
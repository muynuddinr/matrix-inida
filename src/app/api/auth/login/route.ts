import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';

// Demo admin credentials (in production, query from database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
  name: 'Moin',
  email: 'admin@matrixindia.com',
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(
      'admin-001',
      ADMIN_CREDENTIALS.email,
      ADMIN_CREDENTIALS.name
    );

    return NextResponse.json(
      {
        success: true,
        token,
        adminName: ADMIN_CREDENTIALS.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

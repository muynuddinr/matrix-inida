import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if credentials are configured (not placeholder values)
    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes('your-project') ||
      supabaseKey.includes('your-anon-key')
    ) {
      return NextResponse.json(
        {
          status: 'error',
          database: 'disconnected',
          message: 'Supabase credentials not configured properly',
        },
        { status: 200 }
      );
    }

    // Try to connect to Supabase
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      const isConnected = response.ok || response.status === 401;

      return NextResponse.json(
        {
          status: 'success',
          database: isConnected ? 'connected' : 'disconnected',
          server: 'online',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          database: 'disconnected',
          server: 'online',
          message: 'Failed to connect to Supabase',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        server: 'offline',
      },
      { status: 200 }
    );
  }
}

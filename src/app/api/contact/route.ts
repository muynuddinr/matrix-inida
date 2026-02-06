import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats');

    if (stats === 'true') {
      // Return count for dashboard
      const { count, error } = await supabaseAdmin
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to get contact count' },
          { status: 500 }
        );
      }

      return NextResponse.json(count || 0);
    }

    // Return all contacts ordered by newest first
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, subject, country, message, captcha } = await request.json();

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Simple captcha check (configurable via env var, in production use a proper captcha service)
    const expectedCaptcha = process.env.CONTACT_FORM_CAPTCHA || '1069';
    if (captcha !== expectedCaptcha) {
      return NextResponse.json(
        { error: 'Invalid captcha' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          subject,
          country,
          message,
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save contact' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Contact submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
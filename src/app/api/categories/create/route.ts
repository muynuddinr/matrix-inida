import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image_url, status } = body;

    console.log('Creating category:', { name, slug, description, image_url, status });

    // Validation
    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, description' },
        { status: 400 }
      );
    }

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([
        {
          name,
          slug,
          description,
          image_url: image_url || null,
          status: status || 'active',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create category' },
        { status: 500 }
      );
    }

    console.log('Category created successfully:', data?.[0]);
    return NextResponse.json(
      { category: data?.[0], message: 'Category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

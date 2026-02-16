import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image_url, status } = body;

    console.log('Updating category:', { id, name, slug, description, image_url, status });

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, slug' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({
        name,
        slug,
        description: description || null,
        image_url: image_url || null,
        status: status || 'active',
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update category' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { category: data?.[0], message: 'Category updated successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating category:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

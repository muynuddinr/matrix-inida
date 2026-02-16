import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image_url, status, category_name } = body;

    console.log('Updating sub-category:', { id, name, slug, description, image_url, status, category_name });

    if (!id || !name || !slug || !category_name) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, slug, category_name' },
        { status: 400 }
      );
    }

    // Resolve category id
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('name', category_name)
      .single();

    if (categoryError || !categoryData) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('sub_categories')
      .update({
        category_id: categoryData.id,
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
        { error: error.message || 'Failed to update sub-category' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { subCategory: data?.[0], message: 'Sub-category updated successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating sub-category:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

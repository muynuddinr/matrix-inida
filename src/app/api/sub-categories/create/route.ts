import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image_url, status, category_name } = body;

    console.log('Creating sub-category:', { name, slug, description, image_url, status, category_name });

    // Validation
    if (!name || !slug || !description || !category_name) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, description, category_name' },
        { status: 400 }
      );
    }

    // First, get the category_id from category_name
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

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('sub_categories')
      .insert([
        {
          category_id: categoryData.id,
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
        { error: error.message || 'Failed to create sub-category' },
        { status: 500 }
      );
    }

    console.log('Sub-category created successfully:', data?.[0]);
    return NextResponse.json(
      { subCategory: data?.[0], message: 'Sub-category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating sub-category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

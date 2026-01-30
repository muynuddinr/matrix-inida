import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image_url, status, featured, sub_category_name, category_name } = body;

    // Validation
    if (!name || !slug || !category_name) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, category_name' },
        { status: 400 }
      );
    }

    // Get category ID from category name
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

    let subCategoryId: string | null = null;

    // If sub-category is provided, get its ID
    if (sub_category_name) {
      const { data: subCategoryData, error: subCategoryError } = await supabaseAdmin
        .from('sub_categories')
        .select('id')
        .eq('name', sub_category_name)
        .single();

      if (subCategoryError || !subCategoryData) {
        return NextResponse.json(
          { error: 'Sub-category not found' },
          { status: 404 }
        );
      }

      subCategoryId = subCategoryData.id;
    }

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          category_id: categoryData.id,
          sub_category_id: subCategoryId,
          name,
          slug,
          description: description || null,
          image_url: image_url || null,
          status: status || 'active',
          featured: featured || false,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { product: data?.[0], message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

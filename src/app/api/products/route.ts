import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subCategoryId = searchParams.get('sub_category_id');
    const featured = searchParams.get('featured');

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        subcategories (
          id,
          name,
          slug,
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (subCategoryId) {
      query = query.eq('sub_category_id', subCategoryId);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
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
    const { name, slug, description, image_url, featured, status, sub_category_id } = await request.json();

    // Basic validation
    if (!name || !slug || !sub_category_id) {
      return NextResponse.json(
        { error: 'Name, slug, and sub_category_id are required' },
        { status: 400 }
      );
    }

    // Insert product
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name,
          slug,
          description,
          image_url,
          featured: featured || false,
          status: status || 'active',
          sub_category_id,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, slug, description, image_url, featured, status, sub_category_id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        name,
        slug,
        description,
        image_url,
        featured,
        status,
        sub_category_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
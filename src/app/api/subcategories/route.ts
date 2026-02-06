import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    let query = supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order('display_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch subcategories' },
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
    const { name, slug, description, image_url, display_order, category_id } = await request.json();

    // Basic validation
    if (!name || !slug || !category_id) {
      return NextResponse.json(
        { error: 'Name, slug, and category_id are required' },
        { status: 400 }
      );
    }

    // Insert subcategory
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .insert([
        {
          name,
          slug,
          description,
          image_url,
          display_order: display_order || 0,
          category_id,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create subcategory' },
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
    const { id, name, slug, description, image_url, display_order, category_id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .update({
        name,
        slug,
        description,
        image_url,
        display_order,
        category_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update subcategory' },
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
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete subcategory' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  try {
    // Fetch categories with their subcategories
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (categoriesError) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Fetch subcategories
    const { data: subCategories, error: subCategoriesError } = await supabaseAdmin
      .from('subcategories')
      .select('*')
      .order('created_at', { ascending: false });

    if (subCategoriesError) {
      return NextResponse.json(
        { error: 'Failed to fetch subcategories' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      categories: categories || [],
      subCategories: subCategories || []
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  try {
    const { name, slug, description, image_url } = await request.json();

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Insert category
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([
        {
          name,
          slug,
          description,
          image_url,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
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
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  try {
    const { id, name, slug, description, image_url } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({
        name,
        slug,
        description,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update category' },
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
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
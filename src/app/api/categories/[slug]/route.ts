import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch category by slug
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Fetch sub-categories for this category
    const { data: subCategories, error: subCategoriesError } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', category.id)
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (subCategoriesError) {
      console.error('Error fetching sub-categories:', subCategoriesError);
      return NextResponse.json(
        { error: 'Failed to fetch sub-categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      category,
      subCategories: subCategories || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

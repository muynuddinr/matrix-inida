import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; subSlug: string }> }
) {
  try {
    const { slug: categorySlug, subSlug } = await params;

    // First, get the category to find its ID
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', categorySlug)
      .eq('status', 'active')
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get the sub-category
    const { data: subCategory, error: subCategoryError } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', category.id)
      .eq('slug', subSlug)
      .eq('status', 'active')
      .single();

    if (subCategoryError || !subCategory) {
      return NextResponse.json(
        { error: 'Sub-category not found' },
        { status: 404 }
      );
    }

    // Get products for this sub-category
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('sub_category_id', subCategory.id)
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      category,
      subCategory,
      products: products || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

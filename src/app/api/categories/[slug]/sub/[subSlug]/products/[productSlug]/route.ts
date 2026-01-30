import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; subSlug: string; productSlug: string }> }
) {
  try {
    const { slug: categorySlug, subSlug, productSlug } = await params;

    // Get category
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

    // Get sub-category
    const { data: subCategory, error: subCategoryError } = await supabase
      .from('sub_categories')
      .select('id, name, slug')
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

    // Get product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('sub_category_id', subCategory.id)
      .eq('slug', productSlug)
      .eq('status', 'active')
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products (same sub-category, different product)
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('sub_category_id', subCategory.id)
      .neq('id', product.id)
      .eq('status', 'active')
      .limit(4);

    return NextResponse.json({
      category,
      subCategory,
      product,
      relatedProducts: relatedProducts || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

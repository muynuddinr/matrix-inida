import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; subSlug: string; productSlug: string }> }
) {
  try {
    const { slug: categorySlug, subSlug, productSlug } = await params;

    console.log('Fetching product details for:', { categorySlug, subSlug, productSlug });

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

    console.log('Product query result:', { product, productError });
    console.log('Product ID for specs query:', product?.id);

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get technical specifications for the product
    const { data: technicalSpecs, error: specsError } = await supabase
      .from('product_technical_specs')
      .select('id, specification_key, specification_values, display_order')
      .eq('product_id', product.id)
      .order('display_order', { ascending: true });

    console.log(`Technical specifications for ${product.name} (ID: ${product.id}):`, technicalSpecs);
    if (specsError) {
      console.error('Error fetching specs:', specsError);
    }

    // Get related products (same sub-category, different product)
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('sub_category_id', subCategory.id)
      .neq('id', product.id)
      .eq('status', 'active')
      .limit(4);

    // Fetch specs for related products
    const relatedProductsWithSpecs = await Promise.all(
      (relatedProducts || []).map(async (relProduct) => {
        const { data: relSpecs } = await supabase
          .from('product_technical_specs')
          .select('id, specification_key, specification_values, display_order')
          .eq('product_id', relProduct.id)
          .order('display_order', { ascending: true });

        return {
          ...relProduct,
          technical_specs: relSpecs || [],
        };
      })
    );

    console.log(`Fetched product: ${product.name}, related products: ${relatedProductsWithSpecs?.length || 0}`);
    return NextResponse.json({
      category,
      subCategory,
      product: {
        ...product,
        technical_specs: technicalSpecs || [],
      },
      relatedProducts: relatedProductsWithSpecs || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; subSlug: string }> }
) {
  try {
    const { slug: categorySlug, subSlug } = await params;

    console.log('Fetching category, sub-category or product for:', { categorySlug, subSlug });

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

    // First, try to get as a sub-category
    const { data: subCategory, error: subCategoryError } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', category.id)
      .eq('slug', subSlug)
      .eq('status', 'active')
      .single();

    // If it's a valid sub-category, fetch its products
    if (!subCategoryError && subCategory) {
      console.log(`Found sub-category: ${subCategory.name}`);
      
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

      // Fetch technical specs for each product
      const productsWithSpecs = await Promise.all(
        (products || []).map(async (product) => {
          const { data: specs } = await supabase
            .from('product_technical_specs')
            .select('id, specification_key, specification_values, display_order')
            .eq('product_id', product.id)
            .order('display_order', { ascending: true });

          return {
            ...product,
            technical_specs: specs || [],
          };
        })
      );

      console.log(`Fetched category: ${category.name}, sub-category: ${subCategory.name}, products: ${productsWithSpecs?.length || 0}`);
      return NextResponse.json({
        category,
        subCategory,
        products: productsWithSpecs || [],
        type: 'sub-category'
      });
    }

    // If not a sub-category, try to get as a product (product without sub-category)
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .eq('slug', subSlug)
      .eq('status', 'active')
      .single();

    if (!productError && product) {
      console.log(`Found product: ${product.name}`);
      
      // Fetch technical specs for the product
      const { data: specs } = await supabase
        .from('product_technical_specs')
        .select('id, specification_key, specification_values, display_order')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });

      const productWithSpecs = {
        ...product,
        technical_specs: specs || [],
      };

      console.log(`Fetched category: ${category.name}, product: ${product.name}`);
      return NextResponse.json({
        category,
        subCategory: null, // No sub-category for this product
        products: [productWithSpecs],
        type: 'product'
      });
    }

    // Neither sub-category nor product found
    return NextResponse.json(
      { error: 'Sub-category or product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

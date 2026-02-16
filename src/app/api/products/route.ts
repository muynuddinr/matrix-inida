import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('all') === 'true';

    console.log(fetchAll ? 'Fetching all products...' : 'Fetching all active products...');
    // Fetch products based on query param
    let query = supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true });

    if (!fetchAll) {
      query = query.eq('status', 'active');
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform the products and fetch category/subcategory data
    const transformedProducts = await Promise.all(
      (products || []).map(async (product: any) => {
        let categoryName = '';
        let subCategoryName = '';

        // Fetch category name
        if (product.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('name')
            .eq('id', product.category_id)
            .single();
          categoryName = categoryData?.name || '';
        }

        // Fetch sub-category name
        if (product.sub_category_id) {
          const { data: subCategoryData } = await supabase
            .from('sub_categories')
            .select('name')
            .eq('id', product.sub_category_id)
            .single();
          subCategoryName = subCategoryData?.name || '';
        }

        return {
          ...product,
          category: categoryName,
          subCategory: subCategoryName,
        };
      })
    );

    // Fetch technical specs for each product
    const productsWithSpecs = await Promise.all(
      transformedProducts.map(async (product) => {
        const { data: specs, error: specsError } = await supabase
          .from('product_technical_specs')
          .select('id, specification_key, specification_values, display_order')
          .eq('product_id', product.id)
          .order('display_order', { ascending: true });

        if (specs && specs.length > 0) {
          console.log(`Technical specs for product ${product.name}:`, specs);
        }

        return {
          ...product,
          technical_specs: specsError ? [] : (specs || []),
        };
      })
    );

    console.log(`Successfully fetched ${productsWithSpecs?.length || 0} products with specs`);
    return NextResponse.json({ products: productsWithSpecs || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

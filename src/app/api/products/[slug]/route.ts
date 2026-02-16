import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('all') === 'true';

    console.log(fetchAll ? `Fetching product by slug (all): ${slug}` : `Fetching product by slug (active only): ${slug}`);

    // Build query — by default return only active product; when ?all=true return regardless of status
    let productQuery: any = supabase
      .from('products')
      .select('*')
      .eq('slug', slug);

    if (!fetchAll) {
      productQuery = productQuery.eq('status', 'active');
    }

    const { data: product, error: productError } = await productQuery.single();

    if (productError || !product) {
      console.error('Product not found:', productError);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch category data
    let category = null;
    if (product.category_id) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('id', product.category_id)
        .single();
      if (!categoryError && categoryData) {
        category = categoryData;
      }
    }

    // Fetch sub-category data
    let subCategory = null;
    if (product.sub_category_id) {
      const { data: subCategoryData, error: subCategoryError } = await supabase
        .from('sub_categories')
        .select('id, name, slug')
        .eq('id', product.sub_category_id)
        .single();
      if (!subCategoryError && subCategoryData) {
        subCategory = subCategoryData;
      }
    }

    // Fetch technical specs
    const { data: specs, error: specsError } = await supabase
      .from('product_technical_specs')
      .select('id, specification_key, specification_values, display_order')
      .eq('product_id', product.id)
      .order('display_order', { ascending: true });

    // Fetch related products from the same sub-category
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, image_url, featured, display_order
      `)
      .eq('sub_category_id', product.sub_category_id)
      .eq('status', 'active')
      .neq('id', product.id)
      .order('display_order', { ascending: true })
      .limit(4);

    return NextResponse.json({
      product: {
        ...product,
        technical_specs: specsError ? [] : (specs || []),
      },
      category,
      subCategory,
      relatedProducts: relatedError ? [] : (relatedProducts || []),
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('Deleting product with slug:', slug);

    // Delete the product by slug
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

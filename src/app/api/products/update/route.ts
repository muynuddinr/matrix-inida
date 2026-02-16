import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image_url, status, featured, sub_category_name, category_name, technical_specs } = body;

    console.log('Updating product:', { id, name, slug, description, image_url, status, featured, sub_category_name, category_name, technical_specs });

    // Validation
    if (!id || !name || !slug || !category_name) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, slug, category_name' },
        { status: 400 }
      );
    }

    // Get category ID from category name
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('name', category_name)
      .single();

    if (categoryError || !categoryData) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    let subCategoryId: string | null = null;

    // If sub-category is provided, get its ID
    if (sub_category_name) {
      const { data: subCategoryData, error: subCategoryError } = await supabaseAdmin
        .from('sub_categories')
        .select('id')
        .eq('name', sub_category_name)
        .single();

      if (subCategoryError || !subCategoryData) {
        return NextResponse.json(
          { error: 'Sub-category not found' },
          { status: 404 }
        );
      }

      subCategoryId = subCategoryData.id;
    }

    // Update the product
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        category_id: categoryData.id,
        sub_category_id: subCategoryId,
        name,
        slug,
        description: description || null,
        image_url: image_url || null,
        status: status || 'active',
        featured: featured || false,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update product' },
        { status: 500 }
      );
    }

    // Delete existing technical specs
    await supabaseAdmin
      .from('product_technical_specs')
      .delete()
      .eq('product_id', id);

    // Insert new technical specifications if provided (sanitize + merge duplicate keys)
    if (technical_specs && Array.isArray(technical_specs)) {
      const map = new Map();
      (technical_specs || []).forEach((spec: any) => {
        const key = (spec.key || '').toString().trim();
        if (!key) return;
        const norm = key.toLowerCase();
        const vals = (spec.values || []).map((v: any) => (v || '').toString().trim()).filter(Boolean);
        if (!vals.length) return;
        if (!map.has(norm)) map.set(norm, { key, values: new Set(vals) });
        else {
          vals.forEach((v: any) => map.get(norm).values.add(v));
        }
      });

      const specsToInsert = Array.from(map.values()).map((entry: any, idx: number) => ({
        product_id: id,
        specification_key: entry.key,
        specification_values: Array.from(entry.values),
        display_order: idx,
      }));

      if (specsToInsert.length > 0) {
        const { error: specsError } = await supabaseAdmin
          .from('product_technical_specs')
          .insert(specsToInsert);

        if (specsError) {
          console.error('Error inserting technical specs:', specsError);
          // Continue anyway as the product was updated successfully
        }
      }
    }

    console.log('Product updated successfully:', data?.[0]);
    return NextResponse.json(
      { product: data?.[0], message: 'Product updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
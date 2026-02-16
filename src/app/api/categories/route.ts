import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching all active categories...');
    // Fetch all active categories ordered by display_order
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, status, display_order')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    console.log(`Successfully fetched ${categories?.length || 0} categories`);
    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

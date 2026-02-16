import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching all active sub-categories...');
    // Fetch all active sub-categories ordered by display_order
    const { data: subCategories, error } = await supabase
      .from('sub_categories')
      .select('id, name, slug, category_id, image_url, status, display_order')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sub-categories' },
        { status: 500 }
      );
    }

    console.log(`Successfully fetched ${subCategories?.length || 0} sub-categories`);
    return NextResponse.json({ subCategories: subCategories || [] });
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

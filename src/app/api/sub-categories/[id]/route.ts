import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Deleting sub-category with id:', id);

    const { error } = await supabaseAdmin
      .from('sub_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sub-category:', error);
      return NextResponse.json({ error: 'Failed to delete sub-category' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Sub-category deleted successfully' });
  } catch (err) {
    console.error('Error deleting sub-category:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

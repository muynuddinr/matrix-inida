import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('catalog_enquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: enquiries, error, count } = await query;

    if (error) {
      console.error('Error fetching catalog enquiries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch catalog enquiries' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      enquiries: enquiries || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in catalog enquiries API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('catalog_enquiries')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating catalog enquiry:', error);
      return NextResponse.json(
        { error: 'Failed to update catalog enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ enquiry: data });

  } catch (error) {
    console.error('Error in catalog enquiries PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('catalog_enquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting catalog enquiry:', error);
      return NextResponse.json(
        { error: 'Failed to delete catalog enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in catalog enquiries DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
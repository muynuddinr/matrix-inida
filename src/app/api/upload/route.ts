import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
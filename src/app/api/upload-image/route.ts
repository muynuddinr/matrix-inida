import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to Supabase storage
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: `Failed to upload image: ${error.message}` },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get image URL' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { url: urlData.publicUrl, message: 'Image uploaded successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

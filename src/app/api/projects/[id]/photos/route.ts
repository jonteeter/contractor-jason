import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('contractor_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const roomNumber = formData.get('roomNumber') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!roomNumber || !['1', '2', '3'].includes(roomNumber)) {
      return NextResponse.json({ error: 'Invalid room number' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.type === 'image/png' ? 'png' : 'jpg';
    const filePath = `${user.id}/${projectId}/room_${roomNumber}_${timestamp}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('room-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload photo' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('room-photos')
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // Update project with photo URL
    const updateField = `room_${roomNumber}_photo_url`;
    const { error: updateError } = await supabase
      .from('projects')
      .update({ [updateField]: photoUrl })
      .eq('id', projectId)
      .eq('contractor_id', user.id);

    if (updateError) {
      console.error('Project update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to save photo URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photoUrl,
      roomNumber,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { roomNumber } = body;

    if (!roomNumber || !['1', '2', '3'].includes(String(roomNumber))) {
      return NextResponse.json({ error: 'Invalid room number' }, { status: 400 });
    }

    // Get project to find the photo URL
    const photoField = `room_${roomNumber}_photo_url`;
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`id, ${photoField}`)
      .eq('id', projectId)
      .eq('contractor_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const photoUrl = project[photoField as keyof typeof project] as string | null;

    // Delete from storage if URL exists
    if (photoUrl) {
      // Extract file path from URL
      const urlParts = photoUrl.split('/room-photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('room-photos').remove([filePath]);
      }
    }

    // Clear photo URL from project
    const { error: updateError } = await supabase
      .from('projects')
      .update({ [photoField]: null })
      .eq('id', projectId)
      .eq('contractor_id', user.id);

    if (updateError) {
      console.error('Project update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to remove photo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      roomNumber,
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

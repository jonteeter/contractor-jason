import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { signatureType, signatureData } = body;

    if (!signatureType || !signatureData) {
      return NextResponse.json(
        { error: 'Signature type and data are required' },
        { status: 400 }
      );
    }

    if (signatureType !== 'customer' && signatureType !== 'contractor') {
      return NextResponse.json(
        { error: 'Invalid signature type' },
        { status: 400 }
      );
    }

    // Update project with signature
    const updateData: any = {};
    if (signatureType === 'customer') {
      updateData.customer_signature = signatureData;
      updateData.customer_signature_date = new Date().toISOString();
    } else {
      updateData.contractor_signature = signatureData;
      updateData.contractor_signature_date = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('contractor_id', user.id);

    if (updateError) {
      console.error('Error updating signature:', updateError);
      return NextResponse.json(
        { error: 'Failed to save signature' },
        { status: 500 }
      );
    }

    // Fetch updated project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(
        `
        *,
        customer:customers(*)
      `
      )
      .eq('id', id)
      .eq('contractor_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Failed to fetch updated project' },
        { status: 500 }
      );
    }

    // If both signatures are now present, update status to 'approved'
    if (project.customer_signature && project.contractor_signature && project.status !== 'approved') {
      const { error: statusUpdateError } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('id', id)
        .eq('contractor_id', user.id);

      if (!statusUpdateError) {
        project.status = 'approved';
      }
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error saving signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

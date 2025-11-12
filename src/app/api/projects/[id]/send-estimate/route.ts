import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import EstimateEmail from '@/emails/EstimateEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Get contractor info
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .select('*')
      .eq('id', user.id)
      .single();

    if (contractorError || !contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      );
    }

    // Get project with customer info
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
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.customer) {
      return NextResponse.json(
        { error: 'Customer not found for this project' },
        { status: 404 }
      );
    }

    // Prepare room data for email
    const rooms = [];
    if (project.room_1_length && project.room_1_width) {
      rooms.push({
        name: 'Room 1',
        sqft: project.room_1_length * project.room_1_width,
      });
    }
    if (project.room_2_length && project.room_2_width) {
      rooms.push({
        name: 'Room 2',
        sqft: project.room_2_length * project.room_2_width,
      });
    }
    if (project.room_3_length && project.room_3_width) {
      rooms.push({
        name: 'Room 3',
        sqft: project.room_3_length * project.room_3_width,
      });
    }

    // Format labels for display
    const formatFloorType = (type: string) => {
      const labels: Record<string, string> = {
        red_oak: 'Red Oak',
        white_oak: 'White Oak',
        linoleum: 'Linoleum',
      };
      return labels[type] || type;
    };

    const formatFloorSize = (size: string) => {
      const labels: Record<string, string> = {
        '2_inch': '2"',
        '2_5_inch': '2.5"',
        '3_inch': '3"',
      };
      return labels[size] || size;
    };

    const formatFinishType = (finish: string) => {
      const labels: Record<string, string> = {
        stain: 'Stain',
        gloss: 'Gloss',
        semi_gloss: 'Semi-Gloss',
        option: 'Custom Option',
      };
      return labels[finish] || finish;
    };

    const formatStainType = (stain: string | null) => {
      if (!stain) return undefined;
      const labels: Record<string, string> = {
        natural: 'Natural',
        golden_oak: 'Golden Oak',
        spice_brown: 'Spice Brown',
      };
      return labels[stain] || stain;
    };

    // Build full address
    const projectAddress = `${project.customer.address}, ${project.customer.city}, ${project.customer.state} ${project.customer.zip_code}`;

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Tary <onboarding@resend.dev>', // Will be your custom domain later
      to: project.customer.email,
      subject: `Your Flooring Estimate from ${contractor.company_name}`,
      react: EstimateEmail({
        customerName: project.customer.name,
        contractorName: contractor.full_name,
        contractorCompany: contractor.company_name,
        contractorEmail: contractor.email,
        contractorPhone: contractor.phone,
        projectAddress: projectAddress,
        floorType: formatFloorType(project.floor_type),
        floorSize: formatFloorSize(project.floor_size),
        finish: formatFinishType(project.finish_type),
        stain: formatStainType(project.stain_type),
        totalSqFt: project.total_square_feet,
        totalCost: project.estimated_cost,
        rooms: rooms,
        hasTreads: project.stair_treads > 0,
        treadsCount: project.stair_treads,
        hasRisers: project.stair_risers > 0,
        risersCount: project.stair_risers,
      }),
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError },
        { status: 500 }
      );
    }

    // Update project with email tracking info
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        estimate_sent_at: new Date().toISOString(),
        estimate_sent_to: project.customer.email,
        estimate_email_count: (project.estimate_email_count || 0) + 1,
        status: 'sent', // Update status to 'sent'
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating project:', updateError);
      // Email was sent, but tracking update failed - still return success
    }

    return NextResponse.json({
      success: true,
      emailId: emailData?.id,
      sentTo: project.customer.email,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending estimate email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

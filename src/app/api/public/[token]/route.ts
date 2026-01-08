import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isValidToken } from '@/lib/tokens'

// Use service role to bypass RLS for public access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Validate token format
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Fetch project by public token
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        project_name,
        status,
        floor_type,
        floor_size,
        finish_type,
        stain_type,
        total_square_feet,
        estimated_cost,
        room_1_name,
        room_1_length,
        room_1_width,
        room_2_name,
        room_2_length,
        room_2_width,
        room_3_name,
        room_3_length,
        room_3_width,
        stair_treads,
        stair_risers,
        contract_terms,
        customer_signature,
        customer_signed_at,
        created_at,
        customer:customers(
          id,
          name,
          email,
          phone,
          address
        ),
        contractor:contractors(
          id,
          company_name,
          contact_name,
          email,
          phone,
          logo_url
        )
      `)
      .eq('public_token', token)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      )
    }

    // Update customer_viewed_at if not already set
    if (!project.customer_signed_at) {
      await supabaseAdmin
        .from('projects')
        .update({ customer_viewed_at: new Date().toISOString() })
        .eq('public_token', token)
    }

    return NextResponse.json({ project })
  } catch (err) {
    console.error('Public project fetch error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

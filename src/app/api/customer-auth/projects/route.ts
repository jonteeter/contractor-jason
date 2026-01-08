import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET - Get all projects for authenticated customer
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('customer_auth')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get customer by auth token
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, auth_token_expires_at')
      .eq('auth_token', authToken)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Check if token is expired
    if (customer.auth_token_expires_at) {
      const expiresAt = new Date(customer.auth_token_expires_at)
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        )
      }
    }

    // Get all projects for this customer
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        project_name,
        floor_type,
        floor_size,
        finish_type,
        stain_type,
        total_square_feet,
        estimated_cost,
        status,
        created_at,
        customer_signature,
        customer_signature_date,
        public_token,
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
        contractor:contractors(
          company_name,
          contact_name,
          phone,
          email
        )
      `)
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Projects fetch error:', projectsError)
      return NextResponse.json(
        { error: 'Failed to load projects' },
        { status: 500 }
      )
    }

    return NextResponse.json({ projects: projects || [] })
  } catch (err) {
    console.error('Projects error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isValidToken } from '@/lib/tokens'

// Use service role to bypass RLS for public intake access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET - Fetch customer data by intake token (public)
 */
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

    // Fetch customer by intake token
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        name,
        email,
        phone,
        address,
        city,
        state,
        zip_code,
        preferred_contact,
        customer_notes,
        intake_completed_at,
        contractor:contractors(
          company_name,
          contact_name,
          phone,
          email,
          logo_url
        )
      `)
      .eq('intake_token', token)
      .single()

    if (error || !customer) {
      return NextResponse.json(
        { error: 'Intake form not found or link expired' },
        { status: 404 }
      )
    }

    return NextResponse.json({ customer })
  } catch (err) {
    console.error('Intake fetch error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update customer data via intake form (public)
 */
export async function PUT(
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

    const body = await request.json()
    const { name, email, phone, address, city, state, zip_code, preferred_contact, customer_notes } = body

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, email, phone, and address are required' },
        { status: 400 }
      )
    }

    // Update customer
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .update({
        name,
        email,
        phone,
        address,
        city: city || '',
        state: state || '',
        zip_code: zip_code || '',
        preferred_contact: preferred_contact || 'phone',
        customer_notes: customer_notes || '',
        intake_completed_at: new Date().toISOString()
      })
      .eq('intake_token', token)
      .select()
      .single()

    if (error || !customer) {
      console.error('Intake update error:', error)
      return NextResponse.json(
        { error: 'Failed to update information' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer
    })
  } catch (err) {
    console.error('Intake update error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

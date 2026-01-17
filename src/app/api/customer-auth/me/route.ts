import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET - Get current authenticated customer
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

    // Find customer by auth token
    const { data: customer, error: fetchError } = await supabaseAdmin
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
        auth_token_expires_at,
        contractor:contractors(
          company_name,
          contact_name,
          phone,
          email
        )
      `)
      .eq('auth_token', authToken)
      .single()

    if (fetchError || !customer) {
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

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip_code: customer.zip_code,
        contractor: customer.contractor
      }
    })
  } catch (err) {
    console.error('Auth check error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

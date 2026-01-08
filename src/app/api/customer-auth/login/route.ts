import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes, createHash } from 'crypto'

// Use service role to bypass RLS for customer auth
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

function generateAuthToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * POST - Customer login with email and password
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find customer by email
    const { data: customer, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('id, name, email, password_hash, contractor_id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (fetchError || !customer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if customer has a password set
    if (!customer.password_hash) {
      return NextResponse.json(
        { error: 'Account not set up. Please use the setup link sent to your email.' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordHash = hashPassword(password)
    if (passwordHash !== customer.password_hash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate auth token
    const authToken = generateAuthToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    // Update customer with auth token
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        auth_token: authToken,
        auth_token_expires_at: expiresAt.toISOString(),
        last_login_at: new Date().toISOString()
      })
      .eq('id', customer.id)

    if (updateError) {
      console.error('Token update error:', updateError)
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
      )
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email
      }
    })

    // Set auth cookie (httpOnly for security)
    response.cookies.set('customer_auth', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

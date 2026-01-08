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
 * POST - Set up customer password (first time or reset)
 * Requires intake_token for verification
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { intakeToken, password, confirmPassword } = body

    if (!intakeToken) {
      return NextResponse.json(
        { error: 'Setup token is required' },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Find customer by intake token
    const { data: customer, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('id, name, email')
      .eq('intake_token', intakeToken)
      .single()

    if (fetchError || !customer) {
      return NextResponse.json(
        { error: 'Invalid or expired setup link' },
        { status: 400 }
      )
    }

    // Hash password and generate auth token
    const passwordHash = hashPassword(password)
    const authToken = generateAuthToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    // Update customer with password and auth token
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        password_hash: passwordHash,
        auth_token: authToken,
        auth_token_expires_at: expiresAt.toISOString(),
        last_login_at: new Date().toISOString()
      })
      .eq('id', customer.id)

    if (updateError) {
      console.error('Setup error:', updateError)
      return NextResponse.json(
        { error: 'Failed to set up account' },
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

    // Set auth cookie
    response.cookies.set('customer_auth', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    return response
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

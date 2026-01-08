import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST - Logout customer
 */
export async function POST() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('customer_auth')?.value

    if (authToken) {
      // Clear auth token in database
      await supabaseAdmin
        .from('customers')
        .update({
          auth_token: null,
          auth_token_expires_at: null
        })
        .eq('auth_token', authToken)
    }

    // Create response and clear cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('customer_auth')

    return response
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

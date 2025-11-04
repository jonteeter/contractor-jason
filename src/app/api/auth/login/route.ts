import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Login failed - no user returned' }, { status: 400 })
    }

    // Session cookies are automatically set by the createClient helper
    // Return success with redirect instruction
    return NextResponse.json({
      success: true,
      user: data.user,
      redirectTo: '/dashboard'
    })
  } catch (err) {
    console.error('Login API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

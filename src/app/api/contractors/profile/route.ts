import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      company_name,
      contact_name,
      email,
      phone,
      address,
      city,
      state,
      zip_code,
    } = body

    // Validate required fields
    if (!company_name || !contact_name || !email || !phone || !address || !city || !state || !zip_code) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Update contractor in database
    const { data: contractor, error: updateError } = await supabase
      .from('contractors')
      .update({
        company_name,
        contact_name,
        email,
        phone,
        address,
        city,
        state,
        zip_code,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating contractor:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ contractor, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

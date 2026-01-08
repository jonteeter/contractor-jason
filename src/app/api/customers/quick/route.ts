import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generatePublicToken, getIntakeUrl } from '@/lib/tokens'

/**
 * Quick-create a customer with minimal info (just phone or email)
 * Generates an intake token so customer can fill out rest of their info
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user (contractor)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, email, name } = body

    // Need at least phone or email
    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      )
    }

    // Generate intake token
    const intakeToken = generatePublicToken()

    // Create customer with minimal info
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        contractor_id: user.id,
        name: name || 'New Customer',
        email: email || '',
        phone: phone || '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        customer_type: 'residential',
        intake_token: intakeToken,
        intake_token_created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (customerError) {
      console.error('Customer creation error:', customerError)
      return NextResponse.json(
        { error: 'Failed to create customer', details: customerError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer,
      intakeToken,
      intakeUrl: getIntakeUrl(intakeToken)
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

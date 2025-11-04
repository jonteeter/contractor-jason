import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, address, city, state, zip_code, customer_type, project_type } = body

    // Validate required fields
    if (!name || !email || !phone || !address || !customer_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        contractor_id: user.id,
        name,
        email,
        phone,
        address,
        city: city || 'N/A',
        state: state || 'N/A',
        zip_code: zip_code || '00000',
        customer_type,
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

    // Create initial project draft
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        contractor_id: user.id,
        customer_id: customer.id,
        project_name: `${customer.name} - ${project_type === 'new-installation' ? 'New Installation' : 'Refinishing'}`,
        floor_type: 'red_oak', // Default, will be updated in floor selection
        floor_size: '2_5_inch', // Default
        finish_type: 'stain', // Default
        status: 'draft',
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      // Clean up customer if project creation fails
      await supabase.from('customers').delete().eq('id', customer.id)
      return NextResponse.json(
        { error: 'Failed to create project', details: projectError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer,
      project,
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all customers for this contractor
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('contractor_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch customers error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ customers })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

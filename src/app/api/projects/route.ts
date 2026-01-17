import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generatePublicToken } from '@/lib/tokens'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all projects for this contractor with customer data
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('contractor_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch projects error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    return NextResponse.json({ projects })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a new project for an existing customer
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customer_id, project_type } = body

    if (!customer_id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Verify the customer belongs to this contractor
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, name')
      .eq('id', customer_id)
      .eq('contractor_id', user.id)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Generate project name based on customer and type
    const projectTypeName = project_type === 'new-installation' ? 'New Installation' : 'Refinishing'
    const projectName = `${customer.name} - ${projectTypeName}`

    // Create the project with a public token
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        contractor_id: user.id,
        customer_id: customer_id,
        project_name: projectName,
        status: 'draft',
        public_token: generatePublicToken(),
        // Set some defaults
        floor_type: 'red_oak',
        floor_size: '3_inch',
        finish_type: 'semi_gloss',
        total_square_feet: 0,
        estimated_cost: 0
      })
      .select()
      .single()

    if (projectError) {
      console.error('Create project error:', projectError)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ project })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

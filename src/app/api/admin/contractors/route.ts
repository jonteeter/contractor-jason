import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to see all contractors (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch all contractors with their project and customer counts
    const { data: contractors, error } = await supabaseAdmin
      .from('contractors')
      .select(`
        id,
        email,
        company_name,
        contact_name,
        phone,
        subscription_plan,
        is_active,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch contractors:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contractors' },
        { status: 500 }
      )
    }

    // Get project and customer counts for each contractor
    const contractorsWithCounts = await Promise.all(
      (contractors || []).map(async (contractor) => {
        const [projectsResult, customersResult] = await Promise.all([
          supabaseAdmin
            .from('projects')
            .select('id', { count: 'exact', head: true })
            .eq('contractor_id', contractor.id),
          supabaseAdmin
            .from('customers')
            .select('id', { count: 'exact', head: true })
            .eq('contractor_id', contractor.id)
        ])

        return {
          ...contractor,
          project_count: projectsResult.count || 0,
          customer_count: customersResult.count || 0
        }
      })
    )

    return NextResponse.json(contractorsWithCounts)
  } catch (error) {
    console.error('Contractors API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all stats in parallel
    const [
      contractorsResult,
      customersResult,
      projectsResult,
      recentProjectsResult,
      feedbackCountResult
    ] = await Promise.all([
      // Total contractors (using REST API with service role to bypass RLS)
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contractors?select=id`, {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`
        }
      }).then(res => res.json()),

      // Total customers
      supabase
        .from('customers')
        .select('id', { count: 'exact', head: true }),

      // All projects for status breakdown
      supabase
        .from('projects')
        .select('status, estimated_cost'),

      // Recent projects with customer info
      supabase
        .from('projects')
        .select(`
          id,
          project_name,
          status,
          created_at,
          customers (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5),

      // Pending feedback count (using service role would be better but this works for admin)
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/client_feedback?status=eq.new&select=id`, {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`
        }
      }).then(res => res.json())
    ])

    // Calculate project stats
    const projects = projectsResult.data || []
    const projectsByStatus = {
      draft: 0,
      quoted: 0,
      approved: 0,
      in_progress: 0,
      completed: 0
    }

    let totalRevenue = 0
    for (const project of projects) {
      if (project.status && project.status in projectsByStatus) {
        projectsByStatus[project.status as keyof typeof projectsByStatus]++
      }
      if (project.status === 'completed' && project.estimated_cost) {
        totalRevenue += Number(project.estimated_cost)
      }
    }

    // Format recent projects
    const recentProjects = (recentProjectsResult.data || []).map(p => {
      // Handle customers which could be object or array depending on relationship
      const customer = p.customers as unknown
      let customerName = 'Unknown'
      if (customer && typeof customer === 'object') {
        if (Array.isArray(customer) && customer[0]?.name) {
          customerName = customer[0].name
        } else if ('name' in customer && typeof (customer as { name: string }).name === 'string') {
          customerName = (customer as { name: string }).name
        }
      }
      return {
        id: p.id,
        project_name: p.project_name,
        status: p.status,
        created_at: p.created_at,
        customer_name: customerName
      }
    })

    return NextResponse.json({
      totalContractors: Array.isArray(contractorsResult) ? contractorsResult.length : 0,
      totalCustomers: customersResult.count || 0,
      totalProjects: projects.length,
      projectsByStatus,
      recentProjects,
      totalRevenue,
      pendingFeedback: Array.isArray(feedbackCountResult) ? feedbackCountResult.length : 0
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

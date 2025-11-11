import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all projects for this customer
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, project_name, status, estimated_cost, created_at')
      .eq('customer_id', id)
      .eq('contractor_id', user.id) // Ensure projects belong to this contractor
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Error fetching customer projects:', projectsError)
      return NextResponse.json(
        { error: 'Failed to load customer projects' },
        { status: 500 }
      )
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Unexpected error loading customer projects:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

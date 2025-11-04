import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const updates = await request.json()

    // Update project
    const { data: project, error: updateError } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('contractor_id', user.id) // Ensure user owns this project
      .select(`
        *,
        customer:customers(*)
      `)
      .single()

    if (updateError) {
      console.error('Project update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update project', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    // Get project with customer data
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('id', projectId)
      .eq('contractor_id', user.id)
      .single()

    if (error) {
      console.error('Project fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch project' },
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

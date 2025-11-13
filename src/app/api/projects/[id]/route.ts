import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { calculateProjectCost } from '@/lib/pricing/calculateProjectCost'
import { DEFAULT_HARDWOOD_TEMPLATE } from '@/lib/templates/defaultHardwoodTemplate'
import type { ContractorTemplate } from '@/lib/templates/defaultHardwoodTemplate'

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

    // Get the current project to merge with updates
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('contractor_id', user.id)
      .single()

    if (fetchError || !currentProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Merge current project with updates
    const mergedProject = { ...currentProject, ...updates }

    // Check if we need to recalculate pricing
    const hasFloorSpecs = mergedProject.floor_type &&
                          mergedProject.floor_size &&
                          mergedProject.finish_type

    if (hasFloorSpecs) {
      // Get contractor template
      const { data: templateData } = await supabase
        .from('contractor_templates')
        .select('*')
        .eq('contractor_id', user.id)
        .eq('is_active', true)
        .single()

      const template: ContractorTemplate = templateData || DEFAULT_HARDWOOD_TEMPLATE

      // Recalculate pricing automatically
      const pricing = calculateProjectCost(
        {
          floor_type: mergedProject.floor_type,
          floor_size: mergedProject.floor_size,
          finish_type: mergedProject.finish_type,
          stain_type: mergedProject.stain_type
        },
        {
          room_1_length: mergedProject.room_1_length,
          room_1_width: mergedProject.room_1_width,
          room_2_length: mergedProject.room_2_length,
          room_2_width: mergedProject.room_2_width,
          room_3_length: mergedProject.room_3_length,
          room_3_width: mergedProject.room_3_width,
          stair_treads: mergedProject.stair_treads,
          stair_risers: mergedProject.stair_risers
        },
        template
      )

      // Add calculated values to updates
      updates.total_square_feet = pricing.totalSquareFeet
      updates.estimated_cost = pricing.estimatedCost
    }

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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_HARDWOOD_TEMPLATE } from '@/lib/templates/defaultHardwoodTemplate'

// GET /api/contractor-templates - Get contractor's active template (or create default if none exists)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Try to get existing template
    const { data: existingTemplates, error: fetchError } = await supabase
      .from('contractor_templates')
      .select('*')
      .eq('contractor_id', user.id)
      .eq('is_active', true)
      .limit(1)

    if (fetchError) {
      console.error('Error fetching template:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch template' },
        { status: 500 }
      )
    }

    // If template exists, return it
    if (existingTemplates && existingTemplates.length > 0) {
      return NextResponse.json(existingTemplates[0])
    }

    // No template exists - create default hardwood template
    const { data: newTemplate, error: createError } = await supabase
      .from('contractor_templates')
      .insert({
        contractor_id: user.id,
        template_name: 'Hardwood Floor Template',
        floor_types: DEFAULT_HARDWOOD_TEMPLATE.floor_types,
        floor_sizes: DEFAULT_HARDWOOD_TEMPLATE.floor_sizes,
        finish_types: DEFAULT_HARDWOOD_TEMPLATE.finish_types,
        stain_types: DEFAULT_HARDWOOD_TEMPLATE.stain_types,
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating default template:', createError)
      return NextResponse.json(
        { error: 'Failed to create default template' },
        { status: 500 }
      )
    }

    return NextResponse.json(newTemplate)
  } catch (error) {
    console.error('Unexpected error in GET /api/contractor-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/contractor-templates - Create or update template
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { floor_types, floor_sizes, finish_types, stain_types, template_name } = body

    // Deactivate existing templates
    await supabase
      .from('contractor_templates')
      .update({ is_active: false })
      .eq('contractor_id', user.id)
      .eq('is_active', true)

    // Create new template
    const { data: newTemplate, error: createError } = await supabase
      .from('contractor_templates')
      .insert({
        contractor_id: user.id,
        template_name: template_name || 'Custom Template',
        floor_types,
        floor_sizes,
        finish_types,
        stain_types,
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating template:', createError)
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }

    return NextResponse.json(newTemplate)
  } catch (error) {
    console.error('Unexpected error in POST /api/contractor-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/contractor-templates - Update active template
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { floor_types, floor_sizes, finish_types, stain_types, template_name } = body

    // Get active template
    const { data: activeTemplate, error: fetchError } = await supabase
      .from('contractor_templates')
      .select('id')
      .eq('contractor_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (fetchError || !activeTemplate) {
      return NextResponse.json(
        { error: 'No active template found' },
        { status: 404 }
      )
    }

    // Update the template
    const updateData: any = {}
    if (floor_types) updateData.floor_types = floor_types
    if (floor_sizes) updateData.floor_sizes = floor_sizes
    if (finish_types) updateData.finish_types = finish_types
    if (stain_types) updateData.stain_types = stain_types
    if (template_name) updateData.template_name = template_name

    const { data: updatedTemplate, error: updateError } = await supabase
      .from('contractor_templates')
      .update(updateData)
      .eq('id', activeTemplate.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating template:', updateError)
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Unexpected error in PATCH /api/contractor-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

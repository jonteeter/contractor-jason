import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get settings for contractor
    const { data: settings, error: settingsError } = await supabase
      .from('contractor_settings')
      .select('*')
      .eq('contractor_id', user.id)
      .single()

    if (settingsError) {
      // If settings don't exist yet, return defaults
      if (settingsError.code === 'PGRST116') {
        return NextResponse.json({
          settings: {
            email_signature: '',
            send_copy_to_self: true,
            default_labor_rate: 0,
            default_material_markup: 0,
            notify_new_projects: true,
            notify_status_changes: true,
            currency: 'USD',
            date_format: 'MM/DD/YYYY',
            timezone: 'America/New_York',
          }
        })
      }

      console.error('Error fetching settings:', settingsError)
      return NextResponse.json(
        { error: 'Failed to load settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Unexpected error loading settings:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

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
      email_signature,
      send_copy_to_self,
      default_labor_rate,
      default_material_markup,
      notify_new_projects,
      notify_status_changes,
      currency,
      date_format,
      timezone,
    } = body

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('contractor_settings')
      .select('id')
      .eq('contractor_id', user.id)
      .single()

    let result

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('contractor_settings')
        .update({
          email_signature,
          send_copy_to_self,
          default_labor_rate,
          default_material_markup,
          notify_new_projects,
          notify_status_changes,
          currency,
          date_format,
          timezone,
          updated_at: new Date().toISOString(),
        })
        .eq('contractor_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json(
          { error: 'Failed to update settings', details: error.message },
          { status: 500 }
        )
      }

      result = data
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('contractor_settings')
        .insert({
          contractor_id: user.id,
          email_signature,
          send_copy_to_self,
          default_labor_rate,
          default_material_markup,
          notify_new_projects,
          notify_status_changes,
          currency,
          date_format,
          timezone,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating settings:', error)
        return NextResponse.json(
          { error: 'Failed to create settings', details: error.message },
          { status: 500 }
        )
      }

      result = data
    }

    return NextResponse.json({ settings: result, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Unexpected error saving settings:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
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

    // Parse request body
    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip_code,
      customer_type,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !zip_code || !customer_type) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Update customer in database
    const { data: customer, error: updateError } = await supabase
      .from('customers')
      .update({
        name,
        email,
        phone,
        address,
        city,
        state,
        zip_code,
        customer_type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('contractor_id', user.id) // Ensure customer belongs to this contractor
      .select()
      .single()

    if (updateError) {
      console.error('Error updating customer:', updateError)
      return NextResponse.json(
        { error: 'Failed to update customer', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ customer, message: 'Customer updated successfully' })
  } catch (error) {
    console.error('Unexpected error updating customer:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Delete customer (will cascade delete projects due to ON DELETE CASCADE)
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('contractor_id', user.id) // Ensure customer belongs to this contractor

    if (deleteError) {
      console.error('Error deleting customer:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete customer', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Unexpected error deleting customer:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

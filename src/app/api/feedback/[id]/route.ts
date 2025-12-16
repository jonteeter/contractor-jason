import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, developer_notes } = await request.json()

    // Validate status
    if (!['reviewed', 'resolved', 'wont_fix'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = { status }

    if (status === 'resolved' || status === 'wont_fix') {
      updateData.resolved_at = new Date().toISOString()
    }

    if (developer_notes) {
      updateData.developer_notes = developer_notes
    }

    const { error } = await supabaseAdmin
      .from('client_feedback')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Failed to update feedback:', error)
      return NextResponse.json(
        { error: 'Failed to update feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('client_feedback')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete feedback:', error)
      return NextResponse.json(
        { error: 'Failed to delete feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

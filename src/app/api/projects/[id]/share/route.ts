import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generatePublicToken, getPublicUrl } from '@/lib/tokens'

export async function POST(
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

    // Get the current project to check if it already has a token
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('public_token')
      .eq('id', projectId)
      .eq('contractor_id', user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // If already has a token, return it
    if (project.public_token) {
      return NextResponse.json({
        token: project.public_token,
        url: getPublicUrl(project.public_token)
      })
    }

    // Generate a new token
    const newToken = generatePublicToken()

    // Update the project with the new token
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        public_token: newToken,
        token_created_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('contractor_id', user.id)

    if (updateError) {
      console.error('Failed to save token:', updateError)
      return NextResponse.json(
        { error: 'Failed to generate share link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      token: newToken,
      url: getPublicUrl(newToken)
    })
  } catch (err) {
    console.error('Share API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

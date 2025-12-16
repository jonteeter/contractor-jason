import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS for feedback insertion
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { category, message, screenshot, context } = await request.json()

    // Validate required fields
    if (!category || !message || !context?.url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate category
    if (!['bug', 'idea', 'question'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Insert feedback
    const { error } = await supabaseAdmin
      .from('client_feedback')
      .insert({
        category,
        message,
        screenshot, // Store base64 directly for simplicity
        page_url: context.url,
        page_title: context.title || null,
        viewport_width: context.viewport?.width || null,
        viewport_height: context.viewport?.height || null,
        user_agent: context.userAgent || null,
      })

    if (error) {
      console.error('Failed to save feedback:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for fetching feedback (authenticated only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'new'
    const format = searchParams.get('format') || 'json'

    const { data: feedback, error } = await supabaseAdmin
      .from('client_feedback')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch feedback:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      )
    }

    // Return as markdown for Claude Code consumption
    if (format === 'markdown') {
      const markdown = generateMarkdown(feedback || [])
      return new NextResponse(markdown, {
        headers: { 'Content-Type': 'text/markdown' }
      })
    }

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Feedback GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMarkdown(feedback: Array<{
  id: string
  category: string
  message: string
  page_url: string
  page_title: string | null
  viewport_width: number | null
  viewport_height: number | null
  user_agent: string | null
  status: string
  created_at: string
  screenshot: string | null
}>): string {
  if (feedback.length === 0) {
    return '# Client Feedback\n\nNo new feedback to review.'
  }

  const lines = [
    '# Client Feedback',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total: ${feedback.length} items`,
    '',
    '---',
    ''
  ]

  for (const item of feedback) {
    const categoryEmoji = {
      bug: '🐛',
      idea: '💡',
      question: '❓'
    }[item.category] || '📝'

    lines.push(
      `## ${categoryEmoji} ${item.category.toUpperCase()} - ${item.id.slice(0, 8)}`,
      '',
      `**Created**: ${new Date(item.created_at).toLocaleString()}`,
      `**Page**: ${item.page_url}`,
      `**Status**: ${item.status}`,
      '',
      '### Message',
      '',
      item.message,
      '',
      '### Context',
      '',
      `- Title: ${item.page_title || 'N/A'}`,
      `- Viewport: ${item.viewport_width || '?'}x${item.viewport_height || '?'}`,
      `- User Agent: ${item.user_agent || 'N/A'}`,
      ''
    )

    if (item.screenshot) {
      lines.push(
        '### Screenshot',
        '',
        '*Screenshot captured (base64 stored in database)*',
        ''
      )
    }

    lines.push('---', '')
  }

  return lines.join('\n')
}

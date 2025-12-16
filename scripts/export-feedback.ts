/**
 * Export client feedback to markdown for Claude Code consumption
 *
 * Usage: npx tsx scripts/export-feedback.ts
 *
 * This creates/updates feedback/pending.md with all new feedback items
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load env vars
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface FeedbackItem {
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
  developer_notes: string | null
}

async function exportFeedback() {
  console.log('🔄 Fetching feedback from database...')

  const { data: feedback, error } = await supabase
    .from('client_feedback')
    .select('*')
    .in('status', ['new', 'reviewed'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching feedback:', error.message)
    process.exit(1)
  }

  if (!feedback || feedback.length === 0) {
    console.log('✅ No pending feedback to export.')
    return
  }

  console.log(`📝 Found ${feedback.length} feedback items`)

  // Generate markdown
  const markdown = generateMarkdown(feedback as FeedbackItem[])

  // Ensure feedback directory exists
  const feedbackDir = path.join(process.cwd(), 'feedback')
  if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir, { recursive: true })
  }

  // Write markdown file
  const outputPath = path.join(feedbackDir, 'pending.md')
  fs.writeFileSync(outputPath, markdown)

  console.log(`✅ Exported to ${outputPath}`)
  console.log('')
  console.log('📋 Summary:')

  const bugs = feedback.filter(f => f.category === 'bug').length
  const ideas = feedback.filter(f => f.category === 'idea').length
  const questions = feedback.filter(f => f.category === 'question').length

  if (bugs) console.log(`   🐛 Bugs: ${bugs}`)
  if (ideas) console.log(`   💡 Ideas: ${ideas}`)
  if (questions) console.log(`   ❓ Questions: ${questions}`)
}

function generateMarkdown(feedback: FeedbackItem[]): string {
  const lines = [
    '# Client Feedback - Pending Items',
    '',
    `> Generated: ${new Date().toISOString()}`,
    `> Total items: ${feedback.length}`,
    '',
    'Use this file to review and address client feedback. After resolving an item,',
    'update its status in the database to "resolved" or "wont_fix".',
    '',
    '---',
    ''
  ]

  for (const item of feedback) {
    const categoryEmoji = {
      bug: '🐛 BUG',
      idea: '💡 IDEA',
      question: '❓ QUESTION'
    }[item.category] || '📝 FEEDBACK'

    const date = new Date(item.created_at).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    lines.push(
      `## ${categoryEmoji}`,
      '',
      `**ID**: \`${item.id}\``,
      `**Date**: ${date}`,
      `**Status**: ${item.status}`,
      `**Page**: ${item.page_url}`,
      ''
    )

    if (item.page_title) {
      lines.push(`**Page Title**: ${item.page_title}`, '')
    }

    lines.push(
      '### Message',
      '',
      '```',
      item.message,
      '```',
      ''
    )

    lines.push(
      '### Context',
      '',
      `- **Viewport**: ${item.viewport_width || '?'} × ${item.viewport_height || '?'}`,
      `- **User Agent**: ${item.user_agent ? item.user_agent.substring(0, 80) + '...' : 'N/A'}`,
      ''
    )

    if (item.screenshot) {
      lines.push(
        '### Screenshot',
        '',
        '> Screenshot attached (base64 in database)',
        ''
      )
    }

    if (item.developer_notes) {
      lines.push(
        '### Developer Notes',
        '',
        item.developer_notes,
        ''
      )
    }

    lines.push(
      '### Resolution',
      '',
      '```sql',
      `-- Mark as resolved:`,
      `UPDATE client_feedback SET status = 'resolved', resolved_at = NOW() WHERE id = '${item.id}';`,
      '',
      `-- Or mark as won't fix:`,
      `UPDATE client_feedback SET status = 'wont_fix', developer_notes = 'Reason here' WHERE id = '${item.id}';`,
      '```',
      '',
      '---',
      ''
    )
  }

  return lines.join('\n')
}

// Run
exportFeedback().catch(console.error)

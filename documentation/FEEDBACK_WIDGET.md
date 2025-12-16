# Client Feedback Widget - Implementation Plan

## Overview

A floating feedback button for Jason to report bugs, ideas, and questions directly from the app. Captures full context automatically for easy debugging.

## Features

- **Floating button** - Bottom-right corner, unobtrusive
- **Auto-screenshot** - Captures current page state
- **Context capture** - URL, timestamp, viewport, user agent
- **Categories** - Bug, Idea, Question
- **Toggle on/off** - Single env variable: `NEXT_PUBLIC_FEEDBACK_ENABLED=true`
- **Storage** - Supabase table + exportable to markdown for Claude Code

## Usage

**For Jason:**
1. See something wrong? Tap the feedback button
2. Describe the issue
3. Screenshot is captured automatically
4. Submit

**For Developers:**
1. View feedback at `/admin/feedback` (protected)
2. Or run `npm run feedback:export` to dump to markdown
3. Claude Code reads the markdown file

## Implementation

### Environment Variable

```env
# .env.local
NEXT_PUBLIC_FEEDBACK_ENABLED=true  # Set to false in production when not needed
```

### Database Migration

```sql
-- supabase/migrations/009_create_feedback_table.sql
CREATE TABLE client_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Context
  page_url TEXT NOT NULL,
  page_title TEXT,
  viewport_width INTEGER,
  viewport_height INTEGER,
  user_agent TEXT,

  -- Feedback
  category TEXT NOT NULL CHECK (category IN ('bug', 'idea', 'question')),
  message TEXT NOT NULL,
  screenshot_url TEXT,

  -- Meta
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'wont_fix')),
  developer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- No RLS needed - this is for internal use only
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (feedback submission)
CREATE POLICY "Anyone can submit feedback" ON client_feedback
  FOR INSERT WITH CHECK (true);

-- Only service role can read/update (admin only)
CREATE POLICY "Service role can manage feedback" ON client_feedback
  FOR ALL USING (auth.role() = 'service_role');
```

### File Structure

```
src/
├── components/
│   └── feedback/
│       ├── FeedbackWidget.tsx      # Floating button + modal
│       └── FeedbackProvider.tsx    # Context provider
├── app/
│   ├── api/
│   │   └── feedback/
│   │       └── route.ts            # Submit feedback API
│   └── admin/
│       └── feedback/
│           └── page.tsx            # View feedback (protected)
└── lib/
    └── feedback/
        └── screenshot.ts           # Screenshot utility
```

## Components

### FeedbackWidget.tsx

Key features:
- Only renders when `NEXT_PUBLIC_FEEDBACK_ENABLED=true`
- Fixed position bottom-right
- Expands to modal on click
- Auto-captures screenshot on open
- Sends to API on submit

### Screenshot Capture

Using `html2canvas` library:
```typescript
import html2canvas from 'html2canvas'

export async function captureScreenshot(): Promise<string> {
  const canvas = await html2canvas(document.body, {
    logging: false,
    useCORS: true,
    scale: 0.5, // Reduce size
  })
  return canvas.toDataURL('image/jpeg', 0.7)
}
```

### API Route

```typescript
// src/app/api/feedback/route.ts
export async function POST(req: Request) {
  const { category, message, screenshot, context } = await req.json()

  // Upload screenshot to Supabase Storage
  let screenshotUrl = null
  if (screenshot) {
    const filename = `feedback/${Date.now()}.jpg`
    const { data } = await supabase.storage
      .from('feedback-screenshots')
      .upload(filename, base64ToBlob(screenshot))
    screenshotUrl = data?.path
  }

  // Save feedback
  await supabase.from('client_feedback').insert({
    category,
    message,
    screenshot_url: screenshotUrl,
    page_url: context.url,
    page_title: context.title,
    viewport_width: context.viewport.width,
    viewport_height: context.viewport.height,
    user_agent: context.userAgent,
  })

  return NextResponse.json({ success: true })
}
```

## Export for Claude Code

Script to dump feedback to markdown:

```typescript
// scripts/export-feedback.ts
const feedback = await supabase
  .from('client_feedback')
  .select('*')
  .eq('status', 'new')
  .order('created_at', { ascending: false })

const markdown = feedback.data.map(f => `
## ${f.category.toUpperCase()}: ${f.created_at}

**Page**: ${f.page_url}
**Status**: ${f.status}

### Message
${f.message}

### Screenshot
${f.screenshot_url ? `![Screenshot](${f.screenshot_url})` : 'No screenshot'}

### Context
- Viewport: ${f.viewport_width}x${f.viewport_height}
- User Agent: ${f.user_agent}

---
`).join('\n')

fs.writeFileSync('feedback/pending.md', markdown)
```

Run with: `npm run feedback:export`

## Toggle Mechanism

The widget only loads when enabled:

```tsx
// src/app/layout.tsx
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_FEEDBACK_ENABLED === 'true' && (
          <FeedbackWidget />
        )}
      </body>
    </html>
  )
}
```

## UI Design

```
┌─────────────────────────────────────┐
│                                     │
│         (App content)               │
│                                     │
│                                     │
│                                     │
│                           ┌───┐     │
│                           │ ? │ ←── Floating button
│                           └───┘     │
└─────────────────────────────────────┘

On click:
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │  Send Feedback              │    │
│  │                             │    │
│  │  [Bug] [Idea] [Question]    │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ What's on your mind?│    │    │
│  │  │                     │    │    │
│  │  │                     │    │    │
│  │  └─────────────────────┘    │    │
│  │                             │    │
│  │  📷 Screenshot captured     │    │
│  │                             │    │
│  │  [Cancel]        [Submit]   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## Installation Steps

1. Run migration 009
2. Create Supabase Storage bucket: `feedback-screenshots`
3. Install html2canvas: `npm install html2canvas`
4. Add components
5. Add to layout
6. Set env variable
7. Test

## Effort Estimate

| Task | Time |
|------|------|
| Database + Storage setup | 30 min |
| FeedbackWidget component | 2-3 hours |
| API route | 30 min |
| Admin view page | 1-2 hours |
| Export script | 30 min |
| Testing | 1 hour |
| **Total** | **5-7 hours** |

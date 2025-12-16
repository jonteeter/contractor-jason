-- Client Feedback Table
-- For Jason to submit bugs, ideas, questions directly from the app

CREATE TABLE IF NOT EXISTS client_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Context (auto-captured)
  page_url TEXT NOT NULL,
  page_title TEXT,
  viewport_width INTEGER,
  viewport_height INTEGER,
  user_agent TEXT,

  -- Feedback content
  category TEXT NOT NULL CHECK (category IN ('bug', 'idea', 'question')),
  message TEXT NOT NULL,
  screenshot TEXT, -- base64 encoded, stored directly for simplicity

  -- Management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'wont_fix')),
  developer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_feedback_status ON client_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON client_feedback(created_at DESC);

-- RLS: Allow anyone to insert (no auth required for feedback)
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON client_feedback
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (contractors) can view feedback
CREATE POLICY "Authenticated users can view feedback" ON client_feedback
  FOR SELECT USING (auth.role() = 'authenticated');

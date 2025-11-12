-- Add email tracking fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS estimate_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS estimate_sent_to TEXT,
ADD COLUMN IF NOT EXISTS estimate_email_count INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN projects.estimate_sent_at IS 'Timestamp when estimate was last emailed to customer';
COMMENT ON COLUMN projects.estimate_sent_to IS 'Email address where estimate was sent';
COMMENT ON COLUMN projects.estimate_email_count IS 'Number of times estimate has been emailed';

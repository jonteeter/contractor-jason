-- Add public token for customer portal access
-- Allows customers to view estimates via shareable links without authentication

-- Add public_token column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_token TEXT UNIQUE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS customer_viewed_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS customer_signed_at TIMESTAMPTZ;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_projects_public_token ON projects(public_token) WHERE public_token IS NOT NULL;

-- Create a function to generate secure tokens
CREATE OR REPLACE FUNCTION generate_public_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- RLS policy for public token access (read-only, no auth required)
-- This will be accessed via service role in the API, so no RLS policy needed for public access

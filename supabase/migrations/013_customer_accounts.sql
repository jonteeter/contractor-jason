-- Customer accounts system
-- Allows customers to login and view their projects

-- Add auth fields to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_token TEXT UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_token_expires_at TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Create index for auth token lookups
CREATE INDEX IF NOT EXISTS idx_customers_auth_token ON customers(auth_token) WHERE auth_token IS NOT NULL;

-- Note: We're using a simple token-based auth for customers (not full Supabase auth)
-- This keeps it simple and allows contractors to manage their customers directly

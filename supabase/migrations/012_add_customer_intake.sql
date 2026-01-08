-- Add intake token for customer self-service form
-- Allows customers to fill out their own profile info via shareable links

-- Add intake_token column to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS intake_token TEXT UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS intake_token_created_at TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS intake_completed_at TIMESTAMPTZ;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_customers_intake_token ON customers(intake_token) WHERE intake_token IS NOT NULL;

-- Add preferred_contact column for customer preference
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_contact TEXT DEFAULT 'phone';

-- Add notes field for customer-provided notes
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_notes TEXT;

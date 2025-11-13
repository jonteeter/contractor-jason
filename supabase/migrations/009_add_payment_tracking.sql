-- Migration 009: Payment Tracking
-- Created: 2025-11-12
-- Description: Adds payment tracking fields to projects table for tracking deposits and payment schedules

-- Add payment tracking fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS payment_schedule TEXT DEFAULT '60_30_10' CHECK (payment_schedule IN ('60_30_10', '50_50', '100_upfront', 'custom')),
ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS deposit_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_paid_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deposit_payment_method TEXT CHECK (deposit_payment_method IN ('cash', 'check', 'credit_card', 'bank_transfer', 'venmo', 'zelle', 'other')),
ADD COLUMN IF NOT EXISTS progress_payment_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress_payment_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS progress_payment_paid_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS progress_payment_method TEXT CHECK (progress_payment_method IN ('cash', 'check', 'credit_card', 'bank_transfer', 'venmo', 'zelle', 'other')),
ADD COLUMN IF NOT EXISTS final_payment_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_payment_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS final_payment_paid_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS final_payment_method TEXT CHECK (final_payment_method IN ('cash', 'check', 'credit_card', 'bank_transfer', 'venmo', 'zelle', 'other')),
ADD COLUMN IF NOT EXISTS total_paid NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_due NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS projects_deposit_paid_idx ON projects(deposit_paid);
CREATE INDEX IF NOT EXISTS projects_balance_due_idx ON projects(balance_due);

-- Add comment explaining the payment schedule
COMMENT ON COLUMN projects.payment_schedule IS 'Payment schedule type: 60_30_10 (60% deposit, 30% progress, 10% final), 50_50 (50% deposit, 50% final), 100_upfront (full payment upfront), custom (custom amounts)';

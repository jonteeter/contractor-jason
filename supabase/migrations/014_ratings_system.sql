-- Two-way ratings system
-- Contractors can rate customers, customers can rate contractors

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,

  -- Who is being rated
  rating_type TEXT NOT NULL CHECK (rating_type IN ('contractor_rates_customer', 'customer_rates_contractor')),

  -- Rating details
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,

  -- Response (optional)
  response TEXT,
  response_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one rating per type per project
  UNIQUE(project_id, rating_type)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_ratings_contractor ON ratings(contractor_id);
CREATE INDEX IF NOT EXISTS idx_ratings_customer ON ratings(customer_id);
CREATE INDEX IF NOT EXISTS idx_ratings_project ON ratings(project_id);

-- Add average rating columns to contractors and customers for quick access
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1);
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- RLS policies
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Contractors can see all ratings for their projects
CREATE POLICY "Contractors can view their ratings" ON ratings
  FOR SELECT USING (
    contractor_id = auth.uid()
  );

-- Contractors can create ratings for customers
CREATE POLICY "Contractors can rate customers" ON ratings
  FOR INSERT WITH CHECK (
    contractor_id = auth.uid()
    AND rating_type = 'contractor_rates_customer'
  );

-- Note: Customer ratings are handled via public API with token authentication

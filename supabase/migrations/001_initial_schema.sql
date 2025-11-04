-- Lotus Contractor App - Initial Database Schema
-- Created: 2025-11-03
-- Description: Creates contractors, customers, and projects tables with proper relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CONTRACTORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Company Information
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,

  -- Address
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,

  -- Business Settings
  subscription_plan TEXT DEFAULT 'basic' NOT NULL
    CHECK (subscription_plan IN ('basic', 'professional', 'enterprise')),
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Relationships
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,

  -- Customer Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Address
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,

  -- Customer Type
  customer_type TEXT NOT NULL CHECK (customer_type IN ('new', 'existing'))
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Relationships
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,

  -- Project Details
  project_name TEXT NOT NULL,

  -- Floor Specifications
  floor_type TEXT NOT NULL CHECK (floor_type IN ('red_oak', 'white_oak', 'linoleum')),
  floor_size TEXT NOT NULL CHECK (floor_size IN ('2_inch', '2_5_inch', '3_inch')),
  finish_type TEXT NOT NULL CHECK (finish_type IN ('stain', 'gloss', 'semi_gloss', 'option')),
  stain_type TEXT CHECK (stain_type IN ('natural', 'golden_oak', 'spice_brown')),

  -- Measurements
  stair_treads INTEGER NOT NULL DEFAULT 0,
  stair_risers INTEGER NOT NULL DEFAULT 0,
  room_1_length NUMERIC,
  room_1_width NUMERIC,
  room_2_length NUMERIC,
  room_2_width NUMERIC,
  room_3_length NUMERIC,
  room_3_width NUMERIC,

  -- Calculations
  total_square_feet NUMERIC NOT NULL DEFAULT 0,
  estimated_cost NUMERIC NOT NULL DEFAULT 0,

  -- Project Status
  status TEXT DEFAULT 'draft' NOT NULL
    CHECK (status IN ('draft', 'quoted', 'approved', 'in_progress', 'completed'))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS contractors_email_idx ON public.contractors(email);
CREATE INDEX IF NOT EXISTS contractors_active_idx ON public.contractors(is_active);

CREATE INDEX IF NOT EXISTS customers_contractor_id_idx ON public.customers(contractor_id);
CREATE INDEX IF NOT EXISTS customers_email_idx ON public.customers(email);

CREATE INDEX IF NOT EXISTS projects_contractor_id_idx ON public.projects(contractor_id);
CREATE INDEX IF NOT EXISTS projects_customer_id_idx ON public.projects(customer_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);

-- ============================================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contractors_updated_at
  BEFORE UPDATE ON public.contractors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Contractors: Users can only see their own contractor record
CREATE POLICY "Contractors can view own data"
  ON public.contractors
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Contractors can update own data"
  ON public.contractors
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Customers: Contractors can see their own customers
CREATE POLICY "Contractors can view own customers"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can insert own customers"
  ON public.customers
  FOR INSERT
  TO authenticated
  WITH CHECK (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can update own customers"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can delete own customers"
  ON public.customers
  FOR DELETE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

-- Projects: Contractors can see their own projects
CREATE POLICY "Contractors can view own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can insert own projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can update own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can delete own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

-- ============================================================================
-- SEED DATA: Jason's Contractor Account
-- ============================================================================
-- Note: This will be inserted after authentication setup
-- The contractor ID will match Jason's auth.uid() from Supabase Auth

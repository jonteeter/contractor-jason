-- Fix RLS Policies to Allow Authenticated Access
-- Run this in Supabase SQL Editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Contractors can view own data" ON contractors;
DROP POLICY IF EXISTS "Contractors can update own data" ON contractors;
DROP POLICY IF EXISTS "Enable read for own contractor" ON contractors;
DROP POLICY IF EXISTS "Enable update for own contractor" ON contractors;

DROP POLICY IF EXISTS "Contractors can view own customers" ON customers;
DROP POLICY IF EXISTS "Contractors can insert own customers" ON customers;
DROP POLICY IF EXISTS "Contractors can update own customers" ON customers;
DROP POLICY IF EXISTS "Contractors can delete own customers" ON customers;
DROP POLICY IF EXISTS "Enable all for own customers" ON customers;

DROP POLICY IF EXISTS "Contractors can view own projects" ON projects;
DROP POLICY IF EXISTS "Contractors can insert own projects" ON projects;
DROP POLICY IF EXISTS "Contractors can update own projects" ON projects;
DROP POLICY IF EXISTS "Contractors can delete own projects" ON projects;
DROP POLICY IF EXISTS "Enable all for own projects" ON projects;

-- Create new simplified policies
-- CONTRACTORS: Allow authenticated users to read and update their own record
CREATE POLICY "contractors_select_own"
  ON public.contractors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "contractors_update_own"
  ON public.contractors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- CUSTOMERS: Allow contractors to do everything with their own customers
CREATE POLICY "customers_all_own"
  ON public.customers
  FOR ALL
  TO authenticated
  USING (contractor_id = auth.uid());

-- PROJECTS: Allow contractors to do everything with their own projects
CREATE POLICY "projects_all_own"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (contractor_id = auth.uid());

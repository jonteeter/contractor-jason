-- Migration: Create contractor templates table for customizable flooring options
-- Created: 2025-11-11
-- Description: Allows contractors to customize wood types, sizes, finishes with their own pricing
--              Comes with sensible defaults for hardwood floor contractors

-- ============================================================================
-- CONTRACTOR TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contractor_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Relationships
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,

  -- Template Configuration (stored as JSONB for flexibility)
  floor_types JSONB NOT NULL DEFAULT '[]',
  floor_sizes JSONB NOT NULL DEFAULT '[]',
  finish_types JSONB NOT NULL DEFAULT '[]',
  stain_types JSONB NOT NULL DEFAULT '[]',

  -- Metadata
  template_name TEXT DEFAULT 'Default Template',
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS contractor_templates_contractor_id_idx
  ON public.contractor_templates(contractor_id);
CREATE INDEX IF NOT EXISTS contractor_templates_active_idx
  ON public.contractor_templates(is_active);

-- ============================================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================
CREATE TRIGGER contractor_templates_updated_at
  BEFORE UPDATE ON public.contractor_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.contractor_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contractors can view own templates"
  ON public.contractor_templates
  FOR SELECT
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can insert own templates"
  ON public.contractor_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can update own templates"
  ON public.contractor_templates
  FOR UPDATE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can delete own templates"
  ON public.contractor_templates
  FOR DELETE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

-- ============================================================================
-- DEFAULT TEMPLATE FOR HARDWOOD FLOOR CONTRACTORS
-- ============================================================================
-- This will be inserted when a new contractor signs up
-- Example structure for JSONB fields:

-- floor_types: [
--   {
--     "key": "red_oak",
--     "name": "Red Oak",
--     "description": "Classic American hardwood with prominent grain patterns and warm tones",
--     "basePrice": 8.50,
--     "features": ["Durable & Long-lasting", "Classic Grain Pattern", "Warm Natural Tones", "Easy to Refinish"],
--     "image": "🌳"
--   },
--   ...
-- ]

-- floor_sizes: [
--   {
--     "key": "2_inch",
--     "name": "2\"",
--     "description": "Traditional narrow planks",
--     "multiplier": 1.0
--   },
--   ...
-- ]

-- finish_types: [
--   {
--     "key": "stain",
--     "name": "Stain",
--     "description": "Custom color with protective coating",
--     "price": 2.50
--   },
--   ...
-- ]

-- stain_types: [
--   {
--     "key": "natural",
--     "name": "Natural",
--     "description": "Original wood color",
--     "price": 0,
--     "color": "#D2B48C"
--   },
--   ...
-- ]

-- Add comment
COMMENT ON TABLE public.contractor_templates IS 'Stores contractor-specific flooring templates with customizable pricing';
COMMENT ON COLUMN public.contractor_templates.floor_types IS 'JSONB array of floor type configurations with pricing';
COMMENT ON COLUMN public.contractor_templates.floor_sizes IS 'JSONB array of floor size options with multipliers';
COMMENT ON COLUMN public.contractor_templates.finish_types IS 'JSONB array of finish options with pricing';
COMMENT ON COLUMN public.contractor_templates.stain_types IS 'JSONB array of stain color options with pricing';

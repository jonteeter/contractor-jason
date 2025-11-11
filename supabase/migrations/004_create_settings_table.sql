-- Create settings table for user preferences
-- This stores contractor-specific app settings and preferences

CREATE TABLE IF NOT EXISTS public.contractor_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Relationships
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE UNIQUE,

  -- Email Settings
  email_signature TEXT DEFAULT '',
  send_copy_to_self BOOLEAN DEFAULT true,

  -- Default Pricing (for future use)
  default_labor_rate NUMERIC DEFAULT 0,
  default_material_markup NUMERIC DEFAULT 0,

  -- Notification Preferences
  notify_new_projects BOOLEAN DEFAULT true,
  notify_status_changes BOOLEAN DEFAULT true,

  -- App Preferences
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'CAD', 'EUR', 'GBP')),
  date_format TEXT DEFAULT 'MM/DD/YYYY' CHECK (date_format IN ('MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD')),
  timezone TEXT DEFAULT 'America/New_York'
);

-- Index for performance
CREATE INDEX IF NOT EXISTS contractor_settings_contractor_id_idx ON public.contractor_settings(contractor_id);

-- Automatic timestamp updates
CREATE TRIGGER contractor_settings_updated_at
  BEFORE UPDATE ON public.contractor_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.contractor_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Contractors can only see/manage their own settings
CREATE POLICY "Contractors can view own settings"
  ON public.contractor_settings
  FOR SELECT
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can insert own settings"
  ON public.contractor_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can update own settings"
  ON public.contractor_settings
  FOR UPDATE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

CREATE POLICY "Contractors can delete own settings"
  ON public.contractor_settings
  FOR DELETE
  TO authenticated
  USING (contractor_id::text = auth.uid()::text);

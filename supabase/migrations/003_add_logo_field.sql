-- Add logo field to contractors table
-- This will store the URL to the logo image in Supabase Storage

ALTER TABLE public.contractors
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create storage bucket for company logos (Run this in Supabase Dashboard > Storage)
-- Bucket name: company-logos
-- Public: Yes (so logos can be displayed without authentication)
-- File size limit: 2MB
-- Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp

-- Note: Storage bucket creation and RLS policies need to be set up via Supabase Dashboard:
-- 1. Go to Storage > Create bucket
-- 2. Name: company-logos
-- 3. Public: Yes
-- 4. Click "Create bucket"
-- 5. Add policy: INSERT for authenticated users where bucket_id = 'company-logos'
-- 6. Add policy: UPDATE for authenticated users where bucket_id = 'company-logos'
-- 7. Add policy: DELETE for authenticated users where bucket_id = 'company-logos'
-- 8. Add policy: SELECT for public (anyone can view)

-- Migration: Add room photo URL fields to projects table
-- Created: 2025-12-12
-- Description: Stores URLs to room photos in Supabase Storage

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS room_1_photo_url TEXT,
ADD COLUMN IF NOT EXISTS room_2_photo_url TEXT,
ADD COLUMN IF NOT EXISTS room_3_photo_url TEXT;

-- Add helpful comments
COMMENT ON COLUMN projects.room_1_photo_url IS 'URL to room 1 photo in Supabase Storage';
COMMENT ON COLUMN projects.room_2_photo_url IS 'URL to room 2 photo in Supabase Storage';
COMMENT ON COLUMN projects.room_3_photo_url IS 'URL to room 3 photo in Supabase Storage';

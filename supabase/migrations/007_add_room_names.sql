-- Migration: Add room name fields to projects table
-- Created: 2025-11-11
-- Description: Stores custom room names so contractors can label rooms like "Master Bedroom", "Kitchen", etc.

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS room_1_name TEXT,
ADD COLUMN IF NOT EXISTS room_2_name TEXT,
ADD COLUMN IF NOT EXISTS room_3_name TEXT;

-- Add helpful comment
COMMENT ON COLUMN projects.room_1_name IS 'Custom name for room 1 (e.g., "Master Bedroom", "Kitchen")';
COMMENT ON COLUMN projects.room_2_name IS 'Custom name for room 2';
COMMENT ON COLUMN projects.room_3_name IS 'Custom name for room 3';

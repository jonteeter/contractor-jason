-- Add contract-specific fields to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS work_description TEXT,
ADD COLUMN IF NOT EXISTS intro_message TEXT DEFAULT 'Thank you for choosing The Best Hardwood Flooring Co. for your flooring and home improvement needs. Below is a breakdown of the work as we discussed. Please review the information and let me know if I missed anything.',
ADD COLUMN IF NOT EXISTS estimated_days INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS completion_date DATE;

-- Add comment
COMMENT ON COLUMN public.projects.work_description IS 'Detailed description of work to be performed (Exhibit A)';
COMMENT ON COLUMN public.projects.intro_message IS 'Introductory message for estimate/contract';
COMMENT ON COLUMN public.projects.estimated_days IS 'Estimated completion time in business days';
COMMENT ON COLUMN public.projects.start_date IS 'Project start date';
COMMENT ON COLUMN public.projects.completion_date IS 'Expected completion date';

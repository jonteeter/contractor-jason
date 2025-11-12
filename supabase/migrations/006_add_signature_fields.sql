-- Add signature fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS customer_signature TEXT,
ADD COLUMN IF NOT EXISTS customer_signature_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS contractor_signature TEXT,
ADD COLUMN IF NOT EXISTS contractor_signature_date TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN projects.customer_signature IS 'Customer signature as base64 encoded image';
COMMENT ON COLUMN projects.customer_signature_date IS 'Timestamp when customer signed';
COMMENT ON COLUMN projects.contractor_signature IS 'Contractor signature as base64 encoded image';
COMMENT ON COLUMN projects.contractor_signature_date IS 'Timestamp when contractor signed';

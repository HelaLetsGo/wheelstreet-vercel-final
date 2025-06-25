-- Add image_path column to service_tabs table if it doesn't exist
ALTER TABLE service_tabs ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Update existing rows with default value if needed
UPDATE service_tabs SET image_path = '' WHERE image_path IS NULL;

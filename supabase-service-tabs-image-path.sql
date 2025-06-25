-- Add image_path column to service_tabs table
ALTER TABLE service_tabs ADD COLUMN IF NOT EXISTS image_path VARCHAR;

-- Update existing rows with default value if needed
UPDATE service_tabs SET image_path = '' WHERE image_path IS NULL;

-- Refresh the RLS policies to ensure they apply to the new column
BEGIN;
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Admins can do everything with service_tabs" ON service_tabs;
  DROP POLICY IF EXISTS "Anyone can read service_tabs" ON service_tabs;
  
  -- Recreate policies
  CREATE POLICY "Admins can do everything with service_tabs" ON service_tabs
    FOR ALL USING (auth.role() = 'authenticated');
  
  CREATE POLICY "Anyone can read service_tabs" ON service_tabs
    FOR SELECT USING (true);
COMMIT;

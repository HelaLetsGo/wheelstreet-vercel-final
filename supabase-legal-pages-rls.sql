-- First, check if RLS is enabled on the legal_pages table
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'legal_pages';

-- Enable RLS on the legal_pages table if not already enabled
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can do everything with legal_pages" ON legal_pages;
DROP POLICY IF EXISTS "Anonymous users can select legal_pages" ON legal_pages;

-- Create policy for authenticated users (admins)
CREATE POLICY "Admins can do everything with legal_pages" ON legal_pages
FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for anonymous users (can only read legal pages)
CREATE POLICY "Anonymous users can select legal_pages" ON legal_pages
FOR SELECT USING (auth.role() = 'anon');

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'legal_pages';

-- Add missing RLS policies for leads table to allow anonymous users to UPDATE and DELETE
-- This is needed for the admin dashboard to work without service role key

-- Allow anonymous users to update leads
DROP POLICY IF EXISTS "Anonymous users can update leads" ON leads;
CREATE POLICY "Anonymous users can update leads" ON leads
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Allow anonymous users to delete leads  
DROP POLICY IF EXISTS "Anonymous users can delete leads" ON leads;
CREATE POLICY "Anonymous users can delete leads" ON leads
FOR DELETE TO anon
USING (true);

-- Verify current policies (for debugging)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'leads';
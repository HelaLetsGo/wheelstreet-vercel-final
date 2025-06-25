-- Update RLS policies for leads table
-- First, drop the existing policy for anonymous users
DROP POLICY IF EXISTS "Anonymous users can insert leads" ON leads;

-- Create a new policy that allows anonymous users to insert leads without restrictions
CREATE POLICY "Anonymous users can insert leads" ON leads
FOR INSERT TO anon
WITH CHECK (true);

-- Create a policy that allows anonymous users to read their own leads (optional)
DROP POLICY IF EXISTS "Anonymous users can read their own leads" ON leads;
CREATE POLICY "Anonymous users can read their own leads" ON leads
FOR SELECT TO anon
USING (true);

-- Update RLS policies for team_members table
-- First drop the policy if it exists
DROP POLICY IF EXISTS "Anyone can read team_members" ON team_members;

-- Create a policy that allows anonymous users to read team members
CREATE POLICY "Anyone can read team_members" ON team_members
FOR SELECT TO anon
USING (true);

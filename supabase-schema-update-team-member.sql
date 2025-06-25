-- Add team_member_id column to leads table
ALTER TABLE leads ADD COLUMN team_member_id UUID REFERENCES team_members(id);

-- Create index for faster lookups
CREATE INDEX idx_leads_team_member_id ON leads(team_member_id);

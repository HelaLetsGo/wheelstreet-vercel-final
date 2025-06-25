-- Add message field to leads table
ALTER TABLE leads ADD COLUMN message TEXT;

-- Update existing leads to have null message
UPDATE leads SET message = NULL WHERE message IS NULL;

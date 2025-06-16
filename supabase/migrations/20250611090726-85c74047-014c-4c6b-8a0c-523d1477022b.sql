
-- Create a trigger function to sync prospect data to chairlinked_sites
CREATE OR REPLACE FUNCTION sync_prospect_to_chairlinked_site()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the chairlinked_sites table with prospect information
  UPDATE chairlinked_sites 
  SET 
    prospect_name = NEW.name,
    prospect_email = NEW.email,
    updated_at = now()
  WHERE id = NEW.demo_site_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS sync_prospect_data ON demo_prospect_leads;
CREATE TRIGGER sync_prospect_data
  AFTER INSERT ON demo_prospect_leads
  FOR EACH ROW
  EXECUTE FUNCTION sync_prospect_to_chairlinked_site();

-- Sync existing data (one-time migration)
UPDATE chairlinked_sites 
SET 
  prospect_name = dpl.name,
  prospect_email = dpl.email,
  updated_at = now()
FROM demo_prospect_leads dpl
WHERE chairlinked_sites.id = dpl.demo_site_id
AND (chairlinked_sites.prospect_name IS NULL OR chairlinked_sites.prospect_email IS NULL);

-- Add a new table to track claim-to-user relationships
CREATE TABLE IF NOT EXISTS demo_user_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_site_id UUID NOT NULL REFERENCES chairlinked_sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(demo_site_id, user_id)
);

-- Enable RLS on the new table
ALTER TABLE demo_user_claims ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own claims
CREATE POLICY "Users can view their own claims" 
  ON demo_user_claims 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own claims
CREATE POLICY "Users can create their own claims" 
  ON demo_user_claims 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);


-- Add RLS policy to allow users to view their own prospect leads by email
CREATE POLICY "Users can view their own prospect leads by email" 
  ON demo_prospect_leads 
  FOR SELECT 
  USING (email = (auth.jwt() ->> 'email'));

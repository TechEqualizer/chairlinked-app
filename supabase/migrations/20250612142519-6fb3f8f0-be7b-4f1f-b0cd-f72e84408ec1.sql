
-- First, remove the incorrect entry for 24devante@gmail.com
DELETE FROM demo_prospect_leads 
WHERE email = '24devante@gmail.com' 
  AND demo_site_id = (SELECT id FROM chairlinked_sites WHERE site_slug = 'pinkfinbeauty');

-- Create the correct entry linking pinkfinbeauty to your actual email
INSERT INTO demo_prospect_leads (
  demo_site_id,
  name,
  email,
  claimed_at
)
SELECT 
  cs.id,
  up.full_name,
  up.email,
  now()
FROM chairlinked_sites cs
CROSS JOIN user_profiles up
WHERE cs.site_slug = 'pinkfinbeauty'
  AND up.email = 'bigd49812@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM demo_prospect_leads dpl 
    WHERE dpl.demo_site_id = cs.id AND dpl.email = 'bigd49812@gmail.com'
  );

-- Update the site ownership to your correct account
UPDATE chairlinked_sites 
SET 
  user_id = (SELECT user_id FROM user_profiles WHERE email = 'bigd49812@gmail.com'),
  prospect_name = (SELECT full_name FROM user_profiles WHERE email = 'bigd49812@gmail.com'),
  prospect_email = 'bigd49812@gmail.com',
  status = 'live',
  site_type = 'live',
  updated_at = now()
WHERE site_slug = 'pinkfinbeauty';

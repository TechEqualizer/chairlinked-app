
-- Find the pinkfinbeauty site ID and connect it to the user account
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
  AND up.email = '24devante@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM demo_prospect_leads dpl 
    WHERE dpl.demo_site_id = cs.id
  );

-- Update the site ownership and convert to live status
UPDATE chairlinked_sites 
SET 
  user_id = (SELECT user_id FROM user_profiles WHERE email = '24devante@gmail.com'),
  prospect_name = (SELECT full_name FROM user_profiles WHERE email = '24devante@gmail.com'),
  prospect_email = '24devante@gmail.com',
  status = 'live',
  site_type = 'live',
  updated_at = now()
WHERE site_slug = 'pinkfinbeauty';

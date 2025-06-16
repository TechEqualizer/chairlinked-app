
-- Step 1: First, let's check the current state and then make the changes
-- Update the main 'pinkfinbeauty' record to be live and clean up the business name
UPDATE chairlinked_sites 
SET 
  site_type = 'live',
  status = 'live',
  business_name = 'Pink Fin Beauty',
  updated_at = now()
WHERE site_slug = 'pinkfinbeauty';

-- Step 2: Delete the duplicate 'pinkfinbeauty-copy' record and all its related data
-- First delete related prospect leads
DELETE FROM demo_prospect_leads 
WHERE demo_site_id = (
  SELECT id FROM chairlinked_sites WHERE site_slug = 'pinkfinbeauty-copy'
);

-- Delete related traffic records
DELETE FROM chairlinked_traffic 
WHERE site_id = (
  SELECT id FROM chairlinked_sites WHERE site_slug = 'pinkfinbeauty-copy'
);

-- Delete related engagement records
DELETE FROM chairlinked_engagement 
WHERE site_id = (
  SELECT id FROM chairlinked_sites WHERE site_slug = 'pinkfinbeauty-copy'
);

-- Delete related button clicks
DELETE FROM button_clicks 
WHERE site_id = (
  SELECT id FROM chairlinked_sites WHERE site_slug = 'pinkfinbeauty-copy'
);

-- Delete the main site record
DELETE FROM chairlinked_sites 
WHERE site_slug = 'pinkfinbeauty-copy';

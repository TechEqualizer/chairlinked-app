
-- Update the site to be live and clean up the business name and slug
UPDATE chairlinked_sites 
SET 
  site_type = 'live',
  status = 'live',
  business_name = 'Pink Fin Beauty',
  site_slug = 'pinkfinbeauty',
  updated_at = now()
WHERE business_name LIKE '%Pink Fin Beauty%' 
  AND site_type = 'demo';

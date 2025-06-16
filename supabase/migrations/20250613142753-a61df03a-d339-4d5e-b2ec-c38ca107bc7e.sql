
-- Update the BrandnewCutz site to be a proper demo site
UPDATE chairlinked_sites 
SET 
  site_type = 'demo',
  status = 'draft',
  updated_at = now()
WHERE business_name = 'BrandnewCutz' 
  AND site_type = 'live';

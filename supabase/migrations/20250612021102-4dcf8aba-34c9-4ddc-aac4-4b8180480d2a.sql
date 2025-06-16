
-- Remove the older Pinkfinbeauty claim for the specific email
DELETE FROM demo_prospect_leads 
WHERE email = 'bigd49812@gmail.com' 
AND demo_site_id = (
  SELECT cs.id 
  FROM chairlinked_sites cs 
  JOIN demo_prospect_leads dpl ON cs.id = dpl.demo_site_id
  WHERE dpl.email = 'bigd49812@gmail.com' 
  AND cs.business_name = 'Pinkfinbeauty'
  AND dpl.claimed_at < '2025-06-11'
  LIMIT 1
);


-- Remove 24devante@gmail.com from subscribers table (customer base)
DELETE FROM public.subscribers 
WHERE email = '24devante@gmail.com';

-- Ensure 24devante@gmail.com is in team_members as super_admin
-- This will either insert or update the record
INSERT INTO public.team_members (
  user_id, 
  email, 
  full_name, 
  team_role, 
  status,
  permissions
)
SELECT 
  'b5ad4ac4-b3af-4c49-abbe-2953b09e4a15',
  '24devante@gmail.com',
  'Devante',
  'super_admin'::team_role,
  'active',
  '{}'::jsonb
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  team_role = 'super_admin'::team_role,
  status = 'active',
  updated_at = now();

-- Ensure no other users have super_admin role
UPDATE public.team_members 
SET team_role = 'admin'::team_role, updated_at = now()
WHERE team_role = 'super_admin' 
  AND user_id != 'b5ad4ac4-b3af-4c49-abbe-2953b09e4a15';


-- Update 24devante@gmail.com role to admin in user_profiles table
UPDATE public.user_profiles 
SET 
  role = 'admin'::user_role,
  updated_at = now()
WHERE email = '24devante@gmail.com';

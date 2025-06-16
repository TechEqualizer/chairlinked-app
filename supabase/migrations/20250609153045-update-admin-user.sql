
-- Update the existing user profile for 24devante@gmail.com to admin role
UPDATE user_profiles 
SET role = 'admin'::user_role, updated_at = now()
WHERE email = '24devante@gmail.com';


-- Drop ALL policies that might depend on the role column
DROP POLICY IF EXISTS "Admins can view all customization requests" ON public.customization_requests;
DROP POLICY IF EXISTS "Admins can update customization requests" ON public.customization_requests;
DROP POLICY IF EXISTS "Admins can delete customization requests" ON public.customization_requests;
DROP POLICY IF EXISTS "Admins can create customization requests" ON public.customization_requests;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Check for any other policies that might reference role
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.user_profiles;

-- First, ensure the user_role enum exists with correct values
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Remove the admin_emails dependency from handle_new_user function
-- All new users will get 'customer' role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert user profile with explicit type casting and error handling
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'customer'::user_role  -- Explicit casting to user_role enum
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now safely alter the column type
ALTER TABLE public.user_profiles 
  ALTER COLUMN role SET DATA TYPE user_role USING role::user_role;

-- Recreate the essential RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can view all customization requests"
  ON public.customization_requests
  FOR SELECT
  USING (public.is_current_user_admin());

-- Update existing admin user to ensure they keep admin role
UPDATE user_profiles 
SET role = 'admin'::user_role, updated_at = now()
WHERE email = '24devante@gmail.com';

-- Drop the admin_emails table since we no longer need it
DROP TABLE IF EXISTS admin_emails;


-- First, let's check if the trigger exists and recreate it properly
DROP TRIGGER IF EXISTS on_auth_login ON auth.users;
DROP FUNCTION IF EXISTS update_last_login();

-- Recreate the function with proper error handling
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update if the user_id exists in user_profiles
  UPDATE user_profiles 
  SET last_login = now() 
  WHERE user_id = NEW.id;
  
  -- Don't fail if no rows were updated
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block the login
    RAISE WARNING 'Could not update last_login for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE OR REPLACE TRIGGER on_auth_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_last_login();

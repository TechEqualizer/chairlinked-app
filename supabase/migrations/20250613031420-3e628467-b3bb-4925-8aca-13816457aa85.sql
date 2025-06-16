
-- Fix the delete_customer_account function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.delete_customer_account(customer_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  customer_user_id UUID;
  result JSONB;
BEGIN
  -- Get the user_id for the customer
  SELECT user_id INTO customer_user_id 
  FROM public.subscribers 
  WHERE email = customer_email;
  
  IF customer_user_id IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'Customer not found'
    );
    RETURN result;
  END IF;
  
  -- Handle foreign key constraints first - set source_demo_id to NULL in admin_templates
  UPDATE public.admin_templates 
  SET source_demo_id = NULL 
  WHERE source_demo_id IN (
    SELECT id FROM public.chairlinked_sites WHERE user_id = customer_user_id
  );
  
  -- Delete related records (in order due to foreign key constraints)
  DELETE FROM public.payments WHERE user_id = customer_user_id;
  DELETE FROM public.chairlinked_sites WHERE user_id = customer_user_id;
  -- Fix ambiguous column reference by using table alias
  DELETE FROM public.customization_requests cr WHERE cr.customer_email = delete_customer_account.customer_email;
  DELETE FROM public.user_settings WHERE user_id = customer_user_id;
  DELETE FROM public.user_profiles_extended WHERE user_id = customer_user_id;
  DELETE FROM public.user_profiles WHERE user_id = customer_user_id;
  DELETE FROM public.subscribers WHERE email = customer_email;
  
  -- Note: We don't delete from auth.users as that's managed by Supabase Auth
  -- The user can still exist but won't have profile/subscription data
  
  result := jsonb_build_object(
    'success', true,
    'message', 'Customer account deleted successfully'
  );
  
  RETURN result;
END;
$$;

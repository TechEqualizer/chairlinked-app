
-- Add a cancellation tracking field to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT NULL;

-- Function to cancel a customer subscription
CREATE OR REPLACE FUNCTION public.cancel_customer_subscription(
  customer_email TEXT,
  reason TEXT DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update the subscriber record
  UPDATE public.subscribers 
  SET 
    subscribed = false,
    cancelled_at = now(),
    cancellation_reason = reason,
    updated_at = now()
  WHERE email = customer_email;
  
  IF FOUND THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'Subscription cancelled successfully'
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'message', 'Customer not found'
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Function to reactivate a customer subscription
CREATE OR REPLACE FUNCTION public.reactivate_customer_subscription(
  customer_email TEXT
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update the subscriber record
  UPDATE public.subscribers 
  SET 
    subscribed = true,
    cancelled_at = NULL,
    cancellation_reason = NULL,
    updated_at = now()
  WHERE email = customer_email;
  
  IF FOUND THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'Subscription reactivated successfully'
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'message', 'Customer not found'
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Function to safely delete a customer account
CREATE OR REPLACE FUNCTION public.delete_customer_account(
  customer_email TEXT
) 
RETURNS JSONB
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
  
  -- Delete related records (in order due to foreign key constraints)
  DELETE FROM public.payments WHERE user_id = customer_user_id;
  DELETE FROM public.chairlinked_sites WHERE user_id = customer_user_id;
  DELETE FROM public.customization_requests WHERE customer_email = customer_email;
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

-- Grant execute permissions to authenticated users (for admin functions)
GRANT EXECUTE ON FUNCTION public.cancel_customer_subscription(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reactivate_customer_subscription(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_customer_account(TEXT) TO authenticated;


-- Create the site lifecycle stage enum
CREATE TYPE site_lifecycle_stage AS ENUM (
  'draft',
  'ready_to_share', 
  'shared',
  'claimed',
  'converting',
  'customer_controlled',
  'live_published'
);

-- Add lifecycle stage column to chairlinked_sites table
ALTER TABLE chairlinked_sites 
ADD COLUMN lifecycle_stage site_lifecycle_stage DEFAULT 'draft';

-- Add transition tracking timestamps
ALTER TABLE chairlinked_sites 
ADD COLUMN shared_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN payment_initiated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN payment_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN customer_control_granted_at TIMESTAMP WITH TIME ZONE;

-- Create lifecycle audit/history table
CREATE TABLE site_lifecycle_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES chairlinked_sites(id) ON DELETE CASCADE NOT NULL,
  from_stage site_lifecycle_stage,
  to_stage site_lifecycle_stage NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_chairlinked_sites_lifecycle_stage ON chairlinked_sites(lifecycle_stage);
CREATE INDEX idx_chairlinked_sites_shared_at ON chairlinked_sites(shared_at) WHERE shared_at IS NOT NULL;
CREATE INDEX idx_chairlinked_sites_payment_initiated ON chairlinked_sites(payment_initiated_at) WHERE payment_initiated_at IS NOT NULL;
CREATE INDEX idx_site_lifecycle_history_site_id ON site_lifecycle_history(site_id);
CREATE INDEX idx_site_lifecycle_history_changed_at ON site_lifecycle_history(changed_at);

-- Enable RLS on the new audit table
ALTER TABLE site_lifecycle_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for lifecycle history (admins can see all, users can see their own sites)
CREATE POLICY "Admins can view all lifecycle history" 
  ON site_lifecycle_history 
  FOR SELECT 
  USING (is_current_user_admin());

CREATE POLICY "Users can view lifecycle history for their sites" 
  ON site_lifecycle_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM chairlinked_sites 
      WHERE chairlinked_sites.id = site_lifecycle_history.site_id 
      AND chairlinked_sites.user_id = auth.uid()
    )
  );

-- Create function to validate lifecycle stage transitions
CREATE OR REPLACE FUNCTION validate_lifecycle_transition(
  from_stage site_lifecycle_stage,
  to_stage site_lifecycle_stage,
  is_admin BOOLEAN DEFAULT FALSE
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow any transition for admins (with reason required)
  IF is_admin THEN
    RETURN TRUE;
  END IF;
  
  -- Define valid forward transitions
  CASE from_stage
    WHEN 'draft' THEN
      RETURN to_stage IN ('ready_to_share');
    WHEN 'ready_to_share' THEN
      RETURN to_stage IN ('shared');
    WHEN 'shared' THEN
      RETURN to_stage IN ('claimed');
    WHEN 'claimed' THEN
      RETURN to_stage IN ('converting');
    WHEN 'converting' THEN
      RETURN to_stage IN ('customer_controlled', 'claimed'); -- Allow rollback on payment failure
    WHEN 'customer_controlled' THEN
      RETURN to_stage IN ('live_published');
    WHEN 'live_published' THEN
      RETURN FALSE; -- Final state, no transitions allowed except by admin
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$;

-- Create function to handle lifecycle stage transitions with audit trail
CREATE OR REPLACE FUNCTION transition_site_lifecycle(
  site_id UUID,
  new_stage site_lifecycle_stage,
  reason TEXT DEFAULT NULL,
  changed_by UUID DEFAULT auth.uid()
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_stage site_lifecycle_stage;
  is_admin BOOLEAN;
  result JSONB;
BEGIN
  -- Get current stage
  SELECT lifecycle_stage INTO current_stage
  FROM chairlinked_sites
  WHERE id = site_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Site not found');
  END IF;
  
  -- Check if user is admin
  SELECT is_current_user_admin() INTO is_admin;
  
  -- Validate transition
  IF NOT validate_lifecycle_transition(current_stage, new_stage, is_admin) THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', format('Invalid transition from %s to %s', current_stage, new_stage)
    );
  END IF;
  
  -- If admin is making non-standard transition, require reason
  IF is_admin AND reason IS NULL AND NOT validate_lifecycle_transition(current_stage, new_stage, FALSE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reason required for admin override');
  END IF;
  
  -- Update the site lifecycle stage
  UPDATE chairlinked_sites 
  SET 
    lifecycle_stage = new_stage,
    updated_at = now(),
    -- Set specific timestamps based on stage
    shared_at = CASE 
      WHEN new_stage = 'shared' AND shared_at IS NULL THEN now()
      ELSE shared_at
    END,
    payment_initiated_at = CASE 
      WHEN new_stage = 'converting' AND payment_initiated_at IS NULL THEN now()
      ELSE payment_initiated_at
    END,
    payment_completed_at = CASE 
      WHEN new_stage = 'customer_controlled' AND payment_completed_at IS NULL THEN now()
      ELSE payment_completed_at
    END,
    customer_control_granted_at = CASE 
      WHEN new_stage = 'customer_controlled' AND customer_control_granted_at IS NULL THEN now()
      ELSE customer_control_granted_at
    END
  WHERE id = site_id;
  
  -- Create audit trail entry
  INSERT INTO site_lifecycle_history (
    site_id,
    from_stage,
    to_stage,
    changed_by,
    reason,
    metadata
  ) VALUES (
    site_id,
    current_stage,
    new_stage,
    changed_by,
    reason,
    jsonb_build_object(
      'is_admin_override', is_admin AND NOT validate_lifecycle_transition(current_stage, new_stage, FALSE),
      'timestamp', now()
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'from_stage', current_stage,
    'to_stage', new_stage,
    'site_id', site_id
  );
END;
$$;

-- Create function to get lifecycle stage statistics
CREATE OR REPLACE FUNCTION get_lifecycle_stage_stats()
RETURNS TABLE(
  stage site_lifecycle_stage,
  count BIGINT,
  percentage NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH stage_counts AS (
    SELECT 
      lifecycle_stage as stage,
      COUNT(*) as count
    FROM chairlinked_sites
    WHERE lifecycle_stage IS NOT NULL
    GROUP BY lifecycle_stage
  ),
  total_count AS (
    SELECT SUM(count) as total FROM stage_counts
  )
  SELECT 
    sc.stage,
    sc.count,
    ROUND((sc.count * 100.0) / tc.total, 2) as percentage
  FROM stage_counts sc
  CROSS JOIN total_count tc
  ORDER BY 
    CASE sc.stage
      WHEN 'draft' THEN 1
      WHEN 'ready_to_share' THEN 2
      WHEN 'shared' THEN 3
      WHEN 'claimed' THEN 4
      WHEN 'converting' THEN 5
      WHEN 'customer_controlled' THEN 6
      WHEN 'live_published' THEN 7
    END;
$$;

-- Update existing sites to have appropriate lifecycle stages based on current status
UPDATE chairlinked_sites 
SET lifecycle_stage = CASE
  WHEN status = 'draft' THEN 'draft'::site_lifecycle_stage
  WHEN status = 'published' AND site_type = 'demo' AND (prospect_name IS NOT NULL OR prospect_email IS NOT NULL) THEN 'claimed'::site_lifecycle_stage
  WHEN status = 'published' AND site_type = 'demo' THEN 'ready_to_share'::site_lifecycle_stage
  WHEN status = 'published' AND site_type = 'live' AND user_id IS NOT NULL THEN 'customer_controlled'::site_lifecycle_stage
  WHEN status = 'published' AND site_type = 'live' THEN 'live_published'::site_lifecycle_stage
  ELSE 'draft'::site_lifecycle_stage
END
WHERE lifecycle_stage IS NULL OR lifecycle_stage = 'draft';

-- Create trigger to automatically create audit entries for direct updates
CREATE OR REPLACE FUNCTION audit_lifecycle_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create audit entry if lifecycle_stage actually changed
  IF OLD.lifecycle_stage IS DISTINCT FROM NEW.lifecycle_stage THEN
    INSERT INTO site_lifecycle_history (
      site_id,
      from_stage,
      to_stage,
      changed_by,
      reason,
      metadata
    ) VALUES (
      NEW.id,
      OLD.lifecycle_stage,
      NEW.lifecycle_stage,
      auth.uid(),
      'Direct update',
      jsonb_build_object(
        'trigger_source', 'direct_update',
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER chairlinked_sites_lifecycle_audit
  AFTER UPDATE ON chairlinked_sites
  FOR EACH ROW EXECUTE FUNCTION audit_lifecycle_changes();

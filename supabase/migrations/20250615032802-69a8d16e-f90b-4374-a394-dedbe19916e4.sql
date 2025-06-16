
CREATE OR REPLACE FUNCTION public.transition_multiple_sites_lifecycle(
  site_ids uuid[],
  target_stage site_lifecycle_stage,
  reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success_count INT := 0;
  failure_count INT := 0;
  total_count INT;
  results JSONB[] := ARRAY[]::JSONB[];
  site_id UUID;
  transition_result JSONB;
BEGIN
  -- Handle empty array case
  IF site_ids IS NULL OR array_length(site_ids, 1) IS NULL THEN
    total_count := 0;
  ELSE
    total_count := array_length(site_ids, 1);
  END IF;

  -- Loop through each site ID provided
  FOREACH site_id IN ARRAY site_ids
  LOOP
    -- Call the single transition function
    -- The changed_by parameter is implicitly auth.uid() inside the function
    transition_result := public.transition_site_lifecycle(
      site_id,
      target_stage,
      reason
    );

    -- Check the result and update counters
    IF (transition_result->>'success')::BOOLEAN THEN
      success_count := success_count + 1;
    ELSE
      failure_count := failure_count + 1;
    END IF;

    -- Store individual result with site_id for detailed feedback
    results := array_append(results, jsonb_build_object('site_id', site_id) || transition_result);
  END LOOP;

  -- Return a summary of the bulk operation
  RETURN jsonb_build_object(
    'success', failure_count = 0,
    'total_processed', total_count,
    'success_count', success_count,
    'failure_count', failure_count,
    'details', to_jsonb(results)
  );
END;
$$;

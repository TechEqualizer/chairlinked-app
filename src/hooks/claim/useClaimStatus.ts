
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useClaimStatus = (demoSiteId: string) => {
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
  const [checkingClaim, setCheckingClaim] = useState(false);

  useEffect(() => {
    const checkExistingClaim = async () => {
      console.log('Starting claim check for demo site:', demoSiteId);
      
      try {
        setCheckingClaim(true);
        
        const { data, error } = await supabase
          .from('demo_prospect_leads')
          .select('id')
          .eq('demo_site_id', demoSiteId)
          .maybeSingle();

        console.log('Claim check result:', { data, error });

        if (error) {
          console.error('Error checking existing claim:', error);
          setIsAlreadyClaimed(false);
        } else {
          setIsAlreadyClaimed(!!data);
          console.log('Site claimed status:', !!data);
        }
      } catch (error) {
        console.error('Unexpected error checking existing claim:', error);
        setIsAlreadyClaimed(false);
      } finally {
        setCheckingClaim(false);
        console.log('Claim check completed');
      }
    };

    if (demoSiteId) {
      checkExistingClaim();
    }
  }, [demoSiteId]);

  return { isAlreadyClaimed, checkingClaim, setIsAlreadyClaimed };
};

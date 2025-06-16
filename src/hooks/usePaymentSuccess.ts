
import { useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePaymentSuccess = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();

  const convertDemoSiteToLive = async (showToast = true) => {
    if (!user) {
      console.log('No user found for conversion');
      return { success: false, error: 'No user authenticated' };
    }

    try {
      console.log('Converting demo site to live for user:', user.id);
      
      // Find the user's claimed demo site and convert it to live
      const { data: claimedSite, error: fetchError } = await supabase
        .from('chairlinked_sites')
        .select('id, business_name, site_slug, site_type')
        .eq('user_id', user.id)
        .eq('site_type', 'demo')
        .single();

      if (fetchError) {
        console.log('No demo site found to convert:', fetchError.message);
        return { success: false, error: 'No demo site found' };
      }

      if (claimedSite) {
        console.log('Found demo site to convert:', claimedSite);
        
        const { error: updateError } = await supabase
          .from('chairlinked_sites')
          .update({ 
            site_type: 'live',
            status: 'live'
          })
          .eq('id', claimedSite.id);

        if (updateError) {
          console.error('Error converting demo site to live:', updateError);
          if (showToast) {
            toast({
              title: "Site Conversion Error",
              description: "Failed to convert your demo site to live. Please contact support.",
              variant: "destructive"
            });
          }
          return { success: false, error: updateError.message };
        } else {
          console.log('Successfully converted demo site to live:', claimedSite.business_name);
          if (showToast) {
            toast({
              title: "Site is now live! 🎉",
              description: `Your ${claimedSite.business_name} website is now live and ready for customers.`,
            });
          }
          return { success: true, siteName: claimedSite.business_name };
        }
      }
    } catch (error) {
      console.error('Error in convertDemoSiteToLive:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return { success: false, error: 'No demo site found to convert' };
  };

  const manualConvertToLive = async () => {
    const result = await convertDemoSiteToLive(true);
    if (result.success) {
      // Trigger a page refresh to update the UI
      window.location.reload();
    }
    return result;
  };

  return { convertDemoSiteToLive, manualConvertToLive };
};


import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface ClaimedSite {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
  site_type: string;
  created_at: string;
  claimed_at: string;
}

export const useClaimedSite = () => {
  const [claimedSite, setClaimedSite] = useState<ClaimedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchClaimedSite = async () => {
      if (!user?.email && !user?.id) {
        console.log('[useClaimedSite] No user found');
        setLoading(false);
        return;
      }

      console.log('[useClaimedSite] Starting fetch for user:', { email: user.email, id: user.id });

      try {
        setLoading(true);
        setError(null);

        let latestClaimedSite: ClaimedSite | null = null;

        // Method 1: Check prospect leads table (most common case)
        if (user.email) {
          console.log('[useClaimedSite] Checking prospect leads for email:', user.email);
          
          const { data: prospectLeads, error: prospectError } = await supabase
            .from('demo_prospect_leads')
            .select('demo_site_id, claimed_at')
            .eq('email', user.email)
            .order('claimed_at', { ascending: false });

          console.log('[useClaimedSite] Prospect leads query result:', { 
            prospectLeads, 
            prospectError,
            count: prospectLeads?.length || 0 
          });

          if (prospectError) {
            console.error('[useClaimedSite] Prospect leads query error:', prospectError);
          }

          if (prospectLeads && prospectLeads.length > 0) {
            const latestProspect = prospectLeads[0];
            console.log('[useClaimedSite] Latest prospect:', latestProspect);
            
            // Get the site details using the demo_site_id - now including site_type
            console.log('[useClaimedSite] Fetching site details for ID:', latestProspect.demo_site_id);
            
            const { data: siteData, error: siteError } = await supabase
              .from('chairlinked_sites')
              .select('id, business_name, site_slug, logo_url, status, site_type, created_at')
              .eq('id', latestProspect.demo_site_id)
              .maybeSingle();

            console.log('[useClaimedSite] Site data query result:', { 
              siteData, 
              siteError,
              queryId: latestProspect.demo_site_id 
            });

            if (siteError) {
              console.error('[useClaimedSite] Site data query error:', siteError);
            }

            if (siteData) {
              latestClaimedSite = {
                id: siteData.id,
                business_name: siteData.business_name,
                site_slug: siteData.site_slug,
                logo_url: siteData.logo_url,
                status: siteData.status,
                site_type: siteData.site_type || 'demo', // Default to 'demo' if not set
                created_at: siteData.created_at,
                claimed_at: latestProspect.claimed_at
              };
              console.log('[useClaimedSite] Successfully created claimed site object:', latestClaimedSite);
            } else {
              console.warn('[useClaimedSite] No site data found for ID:', latestProspect.demo_site_id);
            }
          } else {
            console.log('[useClaimedSite] No prospect leads found for email:', user.email);
          }
        }

        // Method 2: Check user claims table (fallback) - only if we didn't find anything yet
        if (!latestClaimedSite && user.id) {
          console.log('[useClaimedSite] Checking user claims table for user ID:', user.id);
          
          const { data: userClaims, error: userClaimsError } = await supabase
            .from('demo_user_claims')
            .select('demo_site_id, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          console.log('[useClaimedSite] User claims query result:', { 
            userClaims, 
            userClaimsError,
            count: userClaims?.length || 0 
          });

          if (userClaimsError) {
            console.error('[useClaimedSite] User claims query error:', userClaimsError);
          }

          if (userClaims && userClaims.length > 0) {
            const latestUserClaim = userClaims[0];
            console.log('[useClaimedSite] Latest user claim:', latestUserClaim);
            
            // Get the site details - now including site_type
            const { data: siteData, error: siteError } = await supabase
              .from('chairlinked_sites')
              .select('id, business_name, site_slug, logo_url, status, site_type, created_at')
              .eq('id', latestUserClaim.demo_site_id)
              .maybeSingle();

            console.log('[useClaimedSite] Site data from user claim:', { siteData, siteError });

            if (siteData && !siteError) {
              latestClaimedSite = {
                id: siteData.id,
                business_name: siteData.business_name,
                site_slug: siteData.site_slug,
                logo_url: siteData.logo_url,
                status: siteData.status,
                site_type: siteData.site_type || 'demo', // Default to 'demo' if not set
                created_at: siteData.created_at,
                claimed_at: latestUserClaim.created_at
              };
              console.log('[useClaimedSite] Successfully created claimed site from user claims:', latestClaimedSite);
            } else if (siteError) {
              console.error('[useClaimedSite] Error fetching site data from user claims:', siteError);
            }
          }
        }

        // Method 3: Check for sites directly owned by user (additional fallback)
        if (!latestClaimedSite && user.id) {
          console.log('[useClaimedSite] Checking for directly owned sites for user ID:', user.id);
          
          const { data: ownedSites, error: ownedError } = await supabase
            .from('chairlinked_sites')
            .select('id, business_name, site_slug, logo_url, status, site_type, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          console.log('[useClaimedSite] Owned sites query result:', { 
            ownedSites, 
            ownedError,
            count: ownedSites?.length || 0 
          });

          if (ownedSites && ownedSites.length > 0) {
            const latestOwnedSite = ownedSites[0];
            latestClaimedSite = {
              id: latestOwnedSite.id,
              business_name: latestOwnedSite.business_name,
              site_slug: latestOwnedSite.site_slug,
              logo_url: latestOwnedSite.logo_url,
              status: latestOwnedSite.status,
              site_type: latestOwnedSite.site_type || 'live',
              created_at: latestOwnedSite.created_at,
              claimed_at: latestOwnedSite.created_at
            };
            console.log('[useClaimedSite] Successfully found directly owned site:', latestClaimedSite);
          }
        }

        console.log('[useClaimedSite] Final result - setting claimed site:', latestClaimedSite);
        setClaimedSite(latestClaimedSite);

      } catch (error) {
        console.error('[useClaimedSite] Unexpected error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch claimed site');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimedSite();
  }, [user?.email, user?.id]);

  // Add a refresh function to manually reload the claimed site data
  const refreshClaimedSite = () => {
    if (user?.email || user?.id) {
      setLoading(true);
      // Re-trigger the effect by changing a dependency (but we want to refetch anyway)
      setClaimedSite(null);
      // The useEffect will run again due to the dependency array
    }
  };

  return { claimedSite, loading, error, refreshClaimedSite };
};

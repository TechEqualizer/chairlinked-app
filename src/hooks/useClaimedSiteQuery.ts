
import { useQuery } from '@tanstack/react-query';
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

const fetchClaimedSite = async (userEmail: string, userId: string): Promise<ClaimedSite | null> => {
  // Dev mode mock data
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  if (isDevMode) {
    // Get the demo site info from localStorage if available (set during claim process)
    const claimedDemoInfo = localStorage.getItem('dev_claimed_demo_info');
    let demoInfo = null;
    
    if (claimedDemoInfo) {
      try {
        demoInfo = JSON.parse(claimedDemoInfo);
      } catch (e) {
        console.log('Could not parse claimed demo info');
      }
    }
    
    // Use the actual claimed demo site info or fallback to default
    return {
      id: demoInfo?.demoSiteId || 'demo-1',
      business_name: demoInfo?.businessName || 'Beauty Studio Demo',
      site_slug: demoInfo?.demoSlug || 'beauty-studio-demo',
      logo_url: null,
      status: 'claimed',
      site_type: 'demo',
      created_at: new Date().toISOString(),
      claimed_at: new Date().toISOString()
    };
  }

  let latestClaimedSite: ClaimedSite | null = null;

  // Method 1: Check prospect leads table
  if (userEmail) {
    const { data: prospectLeads, error: prospectError } = await supabase
      .from('demo_prospect_leads')
      .select('demo_site_id, claimed_at')
      .eq('email', userEmail)
      .order('claimed_at', { ascending: false })
      .limit(1);

    if (prospectLeads && prospectLeads.length > 0 && !prospectError) {
      const latestProspect = prospectLeads[0];
      
      const { data: siteData, error: siteError } = await supabase
        .from('chairlinked_sites')
        .select('id, business_name, site_slug, logo_url, status, site_type, created_at')
        .eq('id', latestProspect.demo_site_id)
        .maybeSingle();

      if (siteData && !siteError) {
        latestClaimedSite = {
          id: siteData.id,
          business_name: siteData.business_name,
          site_slug: siteData.site_slug,
          logo_url: siteData.logo_url,
          status: siteData.status,
          site_type: siteData.site_type || 'demo',
          created_at: siteData.created_at,
          claimed_at: latestProspect.claimed_at
        };
      }
    }
  }

  // Method 2: Check user claims table (fallback)
  if (!latestClaimedSite && userId) {
    const { data: userClaims, error: userClaimsError } = await supabase
      .from('demo_user_claims')
      .select('demo_site_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (userClaims && userClaims.length > 0 && !userClaimsError) {
      const latestUserClaim = userClaims[0];
      
      const { data: siteData, error: siteError } = await supabase
        .from('chairlinked_sites')
        .select('id, business_name, site_slug, logo_url, status, site_type, created_at')
        .eq('id', latestUserClaim.demo_site_id)
        .maybeSingle();

      if (siteData && !siteError) {
        latestClaimedSite = {
          id: siteData.id,
          business_name: siteData.business_name,
          site_slug: siteData.site_slug,
          logo_url: siteData.logo_url,
          status: siteData.status,
          site_type: siteData.site_type || 'demo',
          created_at: siteData.created_at,
          claimed_at: latestUserClaim.created_at
        };
      }
    }
  }

  // Method 3: Check for directly owned sites
  if (!latestClaimedSite && userId) {
    const { data: ownedSites, error: ownedError } = await supabase
      .from('chairlinked_sites')
      .select('id, business_name, site_slug, logo_url, status, site_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (ownedSites && ownedSites.length > 0 && !ownedError) {
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
    }
  }

  return latestClaimedSite;
};

export const useClaimedSiteQuery = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['claimed-site', user?.email, user?.id],
    queryFn: () => fetchClaimedSite(user?.email || '', user?.id || ''),
    enabled: !!(user?.email || user?.id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

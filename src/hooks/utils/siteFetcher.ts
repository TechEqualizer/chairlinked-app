
import { supabase } from '@/integrations/supabase/client';
import { SiteWithLifecycle } from '@/types/siteLifecycle';

// Simplified user type for fetcher functions
type UserIdentity = { id?: string; email?: string };

// Timeout wrapper for database queries
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 8000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
}

async function fetchSiteFromProspectLeads(email: string): Promise<SiteWithLifecycle | null> {
  console.log('[siteFetcher] Checking prospect leads for email:', email);

  try {
    // "query" is a builder, ".maybeSingle()" does not execute it yet.
    const query = supabase
      .from('demo_prospect_leads')
      .select(`
        demo_site_id,
        claimed_at,
        chairlinked_sites!inner(*)
      `)
      .eq('email', email)
      .order('claimed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Execute the query and wrap the result in withTimeout
    const result = await withTimeout(query, 6000);

    const prospectData = result.data as any;
    const prospectError = result.error;

    if (prospectError) {
      console.error('[siteFetcher] Prospect leads query error:', prospectError);
      return null;
    }

    if (prospectData && prospectData.chairlinked_sites) {
      console.log('[siteFetcher] Found site via prospect leads:', prospectData.chairlinked_sites.id);
      return prospectData.chairlinked_sites as SiteWithLifecycle;
    }

    console.log('[siteFetcher] No site found via prospect leads');
    return null;
  } catch (error) {
    console.error('[siteFetcher] Timeout/error in fetchSiteFromProspectLeads:', error);
    return null;
  }
}

async function fetchSiteFromUserClaims(userId: string): Promise<SiteWithLifecycle | null> {
  console.log('[siteFetcher] Checking user claims for user ID:', userId);

  try {
    const query = supabase
      .from('demo_user_claims')
      .select(`
        demo_site_id,
        created_at,
        chairlinked_sites!inner(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const result = await withTimeout(query, 6000);

    const claimsData = result.data as any;
    const userClaimsError = result.error;

    if (userClaimsError) {
      console.error('[siteFetcher] User claims query error:', userClaimsError);
      return null;
    }

    if (claimsData && claimsData.chairlinked_sites) {
      console.log('[siteFetcher] Found site via user claims:', claimsData.chairlinked_sites.id);
      return claimsData.chairlinked_sites as SiteWithLifecycle;
    }

    console.log('[siteFetcher] No site found via user claims');
    return null;
  } catch (error) {
    console.error('[siteFetcher] Timeout/error in fetchSiteFromUserClaims:', error);
    return null;
  }
}

async function fetchSiteFromOwnedSites(userId: string): Promise<SiteWithLifecycle | null> {
  console.log('[siteFetcher] Checking owned sites for user ID:', userId);

  try {
    const query = supabase
      .from('chairlinked_sites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const result = await withTimeout(query, 5000);

    const ownedSites = result.data as any;
    const ownedError = result.error;

    if (ownedError) {
      console.error('[siteFetcher] Owned sites query error:', ownedError);
      return null;
    }

    if (ownedSites) {
      console.log('[siteFetcher] Found owned site:', ownedSites.id);
      return ownedSites;
    }

    console.log('[siteFetcher] No owned sites found');
    return null;
  } catch (error) {
    console.error('[siteFetcher] Timeout/error in fetchSiteFromOwnedSites:', error);
    return null;
  }
}

export async function findClaimedSite(user: UserIdentity): Promise<SiteWithLifecycle | null> {
  console.log('[siteFetcher] Starting site search for user:', { email: user.email, id: user.id });

  let claimedSite: SiteWithLifecycle | null = null;

  try {
    if (user.email) {
      console.log('[siteFetcher] Trying prospect leads...');
      claimedSite = await fetchSiteFromProspectLeads(user.email);
      if (claimedSite) {
        console.log('[siteFetcher] Found site via prospect leads');
        return claimedSite;
      }
    }

    if (user.id) {
      console.log('[siteFetcher] Trying user claims...');
      claimedSite = await fetchSiteFromUserClaims(user.id);
      if (claimedSite) {
        console.log('[siteFetcher] Found site via user claims');
        return claimedSite;
      }

      console.log('[siteFetcher] Trying owned sites...');
      claimedSite = await fetchSiteFromOwnedSites(user.id);
      if (claimedSite) {
        console.log('[siteFetcher] Found site via owned sites');
        return claimedSite;
      }
    }

    console.log('[siteFetcher] No site found through any method');
    return null;
  } catch (error) {
    console.error('[siteFetcher] Critical error in findClaimedSite:', error);
    return null;
  }
}


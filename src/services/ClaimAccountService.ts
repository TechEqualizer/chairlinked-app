
import { supabase } from '@/integrations/supabase/client';

export class ClaimAccountService {
  /**
   * Links an existing demo claim to a user account when they sign up
   */
  static async linkClaimToAccount(userEmail: string, userId: string) {
    try {
      // Find existing demo claims for this email
      const { data: existingClaims, error: claimsError } = await supabase
        .from('demo_prospect_leads')
        .select('demo_site_id')
        .eq('email', userEmail);

      if (claimsError) {
        console.error('Error fetching existing claims:', claimsError);
        return { success: false, error: claimsError };
      }

      if (existingClaims && existingClaims.length > 0) {
        // Link each claim to the user account
        const linkPromises = existingClaims.map(claim => 
          supabase
            .from('demo_user_claims')
            .upsert({
              demo_site_id: claim.demo_site_id,
              user_id: userId,
              claimed_email: userEmail
            }, {
              onConflict: 'demo_site_id,user_id'
            })
        );

        const results = await Promise.all(linkPromises);
        const errors = results.filter(result => result.error);

        if (errors.length > 0) {
          console.error('Error linking some claims:', errors);
          return { success: false, error: errors[0].error };
        }

        console.log(`Successfully linked ${existingClaims.length} claims to user account`);
        return { success: true, linkedClaims: existingClaims.length };
      }

      return { success: true, linkedClaims: 0 };
    } catch (error) {
      console.error('Error in linkClaimToAccount:', error);
      return { success: false, error };
    }
  }

  /**
   * Checks if a user has any claimed sites
   */
  static async getUserClaimedSites(userId: string) {
    try {
      const { data, error } = await supabase
        .from('demo_user_claims')
        .select(`
          created_at,
          chairlinked_sites (
            id,
            business_name,
            site_slug,
            logo_url,
            status,
            created_at
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user claimed sites:', error);
        return { success: false, error, sites: [] };
      }

      return { success: true, sites: data || [] };
    } catch (error) {
      console.error('Error in getUserClaimedSites:', error);
      return { success: false, error, sites: [] };
    }
  }
}


import type { Template8Data } from '../../types/GeneratorTypes';
import type { SaveResult } from '../types/SaveServiceTypes';
import { supabase } from '@/integrations/supabase/client';
import { generateSiteUrl } from '@/utils/urlGenerator';
import { SlugUtils } from '../utils/slugUtils';

export class DemoCreator {
  static async createNewDemo(data: Partial<Template8Data>, userId: string): Promise<SaveResult> {
    try {
      console.log('[DemoCreator] Creating new demo for user:', userId);
      
      // Check if the user is an admin to determine site_type
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.warn('[DemoCreator] Could not fetch user profile, defaulting to customer:', profileError);
      }

      const isAdmin = userProfile?.role === 'admin';
      console.log('[DemoCreator] User is admin:', isAdmin);

      // Set appropriate site_type and status based on who is creating the demo
      const siteType = isAdmin ? 'demo' : 'live';
      const status = isAdmin ? 'draft' : 'active';

      // Generate a clean, human-readable slug
      const businessName = data.businessName || 'Untitled Demo';
      const siteSlug = await SlugUtils.generateUniqueSlug(businessName);

      console.log('[DemoCreator] Generated slug:', siteSlug, 'for business:', businessName);

      const { data: newDemo, error } = await supabase
        .from('chairlinked_sites')
        .insert({
          business_name: businessName,
          generated_config: data,
          form_data: data, // Required field - use the same data
          user_id: userId,
          admin_user_id: isAdmin ? userId : null, // Set admin_user_id if created by admin
          site_slug: siteSlug,
          site_type: siteType,
          status: status
        })
        .select()
        .single();

      if (error) {
        console.error('[DemoCreator] Creation failed:', error);
        return {
          success: false,
          error: `Failed to create demo: ${error.message}`
        };
      }

      console.log('[DemoCreator] Demo created successfully:', {
        id: newDemo.id,
        site_type: newDemo.site_type,
        status: newDemo.status,
        site_slug: newDemo.site_slug,
        isAdmin
      });

      // Generate the proper demo URL using the new structure
      const demoUrl = generateSiteUrl({
        slug: newDemo.site_slug,
        siteType: newDemo.site_type as 'demo' | 'live',
        status: newDemo.status as 'draft' | 'published'
      });
      
      return {
        success: true,
        url: demoUrl
      };
    } catch (error) {
      console.error('[DemoCreator] Unexpected error:', error);
      return {
        success: false,
        error: `Unexpected error during demo creation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

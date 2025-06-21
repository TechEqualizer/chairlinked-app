
import type { Template8Data } from '../../types/GeneratorTypes';
import type { SaveResult } from '../types/SaveServiceTypes';
import { supabase } from '@/integrations/supabase/client';

export class DemoUpdater {
  static async updateExistingDemo(data: Partial<Template8Data>, demoId: string, userId: string): Promise<SaveResult> {
    try {
      console.log('[DemoUpdater] Updating existing demo:', demoId);
      console.log('[DemoUpdater] Update data:', data);
      
      const { data: updatedDemo, error } = await supabase
        .from('chairlinked_sites')
        .update({
          business_name: data.businessName || 'Untitled Demo',
          generated_config: data,
          form_data: data, // Include form_data for consistency
          updated_at: new Date().toISOString()
        })
        .eq('id', demoId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('[DemoUpdater] Update failed:', error);
        return {
          success: false,
          error: `Failed to update demo: ${error.message}`
        };
      }

      if (!updatedDemo) {
        console.error('[DemoUpdater] No demo returned after update');
        return {
          success: false,
          error: 'Demo not found or permission denied'
        };
      }

      const demoUrl = `/demo/${updatedDemo.site_slug}`;
      
      console.log('[DemoUpdater] Update successful, URL:', demoUrl);
      return {
        success: true,
        url: demoUrl,
        demoId: updatedDemo.id
      };
    } catch (error) {
      console.error('[DemoUpdater] Unexpected error:', error);
      return {
        success: false,
        error: `Unexpected error during demo update: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

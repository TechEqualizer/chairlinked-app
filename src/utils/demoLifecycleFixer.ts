/**
 * Utility to fix demo sites that have been published but don't have correct lifecycle stages
 * This addresses the issue where claim buttons don't appear for team-shared demos
 */

import { supabase } from '@/integrations/supabase/client';
import { SiteLifecycleStage } from '@/types/siteLifecycle';

export interface LifecycleFix {
  siteId: string;
  currentStage: SiteLifecycleStage | null;
  newStage: SiteLifecycleStage;
  reason: string;
}

/**
 * Identifies demo sites that need lifecycle stage fixes
 */
export const identifyDemosNeedingFixes = async (): Promise<LifecycleFix[]> => {
  const fixes: LifecycleFix[] = [];

  try {
    // Find published demo sites that don't have proper lifecycle stages
    const { data: sites, error } = await supabase
      .from('chairlinked_sites')
      .select('id, site_slug, business_name, status, lifecycle_stage, site_type')
      .eq('site_type', 'demo')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching demo sites:', error);
      return fixes;
    }

    for (const site of sites || []) {
      // Sites that are published but don't have appropriate lifecycle stages
      if (!site.lifecycle_stage || site.lifecycle_stage === 'draft') {
        fixes.push({
          siteId: site.id,
          currentStage: site.lifecycle_stage,
          newStage: 'shared',
          reason: 'Published demo site without proper lifecycle stage - setting to "shared" for claim button visibility'
        });
      }
    }

    console.log(`[demoLifecycleFixer] Found ${fixes.length} demo sites needing lifecycle fixes`);
    return fixes;

  } catch (error) {
    console.error('Error identifying demos needing fixes:', error);
    return fixes;
  }
};

/**
 * Applies lifecycle fixes to demo sites
 */
export const applyLifecycleFixes = async (fixes: LifecycleFix[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> => {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const fix of fixes) {
    try {
      console.log(`[demoLifecycleFixer] Applying fix to site ${fix.siteId}: ${fix.currentStage} → ${fix.newStage}`);
      
      const { error } = await supabase
        .from('chairlinked_sites')
        .update({
          lifecycle_stage: fix.newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', fix.siteId);

      if (error) {
        console.error(`Error fixing site ${fix.siteId}:`, error);
        errors.push(`Site ${fix.siteId}: ${error.message}`);
        failed++;
      } else {
        console.log(`[demoLifecycleFixer] Successfully fixed site ${fix.siteId}`);
        success++;
      }
    } catch (error) {
      console.error(`Exception fixing site ${fix.siteId}:`, error);
      errors.push(`Site ${fix.siteId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }
  }

  console.log(`[demoLifecycleFixer] Fixes complete: ${success} success, ${failed} failed`);
  return { success, failed, errors };
};

/**
 * Auto-fix function that can be called to ensure demo sites have correct lifecycle stages
 */
export const autoFixDemoLifecycles = async (): Promise<boolean> => {
  try {
    console.log('[demoLifecycleFixer] Starting auto-fix for demo lifecycles...');
    
    const fixes = await identifyDemosNeedingFixes();
    
    if (fixes.length === 0) {
      console.log('[demoLifecycleFixer] No demo sites need fixing');
      return true;
    }

    const results = await applyLifecycleFixes(fixes);
    
    if (results.failed > 0) {
      console.error('[demoLifecycleFixer] Some fixes failed:', results.errors);
      return false;
    }

    console.log(`[demoLifecycleFixer] Successfully fixed ${results.success} demo sites`);
    return true;

  } catch (error) {
    console.error('[demoLifecycleFixer] Auto-fix failed:', error);
    return false;
  }
};
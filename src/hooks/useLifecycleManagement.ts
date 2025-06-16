
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SiteLifecycleStage, LifecycleTransitionResult, LIFECYCLE_STAGE_CONFIG } from '@/types/siteLifecycle';
import { supabase } from '@/integrations/supabase/client';

export const useLifecycleManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const transitionSiteLifecycle = async (
    siteId: string, 
    targetStage: SiteLifecycleStage, 
    reason?: string
  ): Promise<LifecycleTransitionResult> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('transition_site_lifecycle', {
        site_id: siteId,
        new_stage: targetStage,
        reason: reason || null
      });

      if (error) {
        console.error('Lifecycle transition error:', error);
        toast({
          title: "Transition Failed",
          description: error.message || "Failed to update site lifecycle stage",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      // Type assertion for the RPC response
      const result = data as any;
      
      if (result?.success) {
        toast({
          title: "Stage Updated",
          description: `Site moved from ${result.from_stage} to ${result.to_stage}`,
          variant: "default",
        });
        return {
          success: true,
          from_stage: result.from_stage,
          to_stage: result.to_stage,
          site_id: siteId
        };
      } else {
        const errorMsg = result?.error || "Unknown error occurred";
        toast({
          title: "Transition Failed",
          description: errorMsg,
          variant: "destructive",
        });
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Lifecycle transition exception:', error);
      const errorMsg = error instanceof Error ? error.message : "Network error occurred";
      toast({
        title: "Transition Failed",
        description: errorMsg,
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const transitionMultipleSitesLifecycle = async (
    siteIds: string[],
    targetStage: SiteLifecycleStage,
    reason?: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('transition_multiple_sites_lifecycle', {
        site_ids: siteIds,
        target_stage: targetStage,
        reason: reason || null,
      });

      if (error) {
        throw error;
      }
      
      const result = data as any;
      if (result.failure_count > 0) {
        toast({
          title: `Bulk Action: ${result.success_count}/${result.total_processed} Succeeded`,
          description: `${result.failure_count} site(s) could not be moved to ${LIFECYCLE_STAGE_CONFIG[targetStage].label}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Bulk Action Successful",
          description: `All ${result.success_count} selected sites moved to ${LIFECYCLE_STAGE_CONFIG[targetStage].label}.`,
        });
      }
      return result;
    } catch (error) {
      console.error('Bulk lifecycle transition error:', error);
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Bulk Transition Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transitionSiteLifecycle,
    transitionMultipleSitesLifecycle,
    isLoading
  };
};

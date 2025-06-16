
import { useState, useCallback } from 'react';
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useBulkDeleteDemos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, user } = useAuthContext();
  const { toast } = useToast();

  const bulkDeleteDemos = useCallback(async (demoIds: string[]) => {
    if (!isAdmin || !user || demoIds.length === 0) {
      console.error('bulkDeleteDemos: User not authorized or no demos to delete');
      return;
    }

    setIsLoading(true);
    console.log('bulkDeleteDemos: Starting bulk deletion for:', demoIds);
    
    try {
      // Step 1: Delete related prospect leads first
      console.log('bulkDeleteDemos: Deleting prospect leads...');
      const { error: prospectError } = await supabase
        .from('demo_prospect_leads')
        .delete()
        .in('demo_site_id', demoIds);

      if (prospectError) {
        console.error('bulkDeleteDemos: Error deleting prospect leads:', prospectError);
        throw new Error(`Failed to delete prospect leads: ${prospectError.message}`);
      }

      // Step 2: Delete related traffic records
      console.log('bulkDeleteDemos: Deleting traffic records...');
      const { error: trafficError } = await supabase
        .from('chairlinked_traffic')
        .delete()
        .in('site_id', demoIds);

      if (trafficError) {
        console.error('bulkDeleteDemos: Error deleting traffic records:', trafficError);
        throw new Error(`Failed to delete traffic records: ${trafficError.message}`);
      }

      // Step 3: Delete engagement records
      console.log('bulkDeleteDemos: Deleting engagement records...');
      const { error: engagementError } = await supabase
        .from('chairlinked_engagement')
        .delete()
        .in('site_id', demoIds);

      if (engagementError) {
        console.error('bulkDeleteDemos: Error deleting engagement records:', engagementError);
        throw new Error(`Failed to delete engagement records: ${engagementError.message}`);
      }

      // Step 4: Delete button clicks
      console.log('bulkDeleteDemos: Deleting button clicks...');
      const { error: clicksError } = await supabase
        .from('button_clicks')
        .delete()
        .in('site_id', demoIds);

      if (clicksError) {
        console.error('bulkDeleteDemos: Error deleting button clicks:', clicksError);
        throw new Error(`Failed to delete button clicks: ${clicksError.message}`);
      }

      // Step 5: Update admin templates to remove source_demo_id references
      console.log('bulkDeleteDemos: Updating admin templates...');
      const { error: templateError } = await supabase
        .from('admin_templates')
        .update({ source_demo_id: null })
        .in('source_demo_id', demoIds);

      if (templateError) {
        console.error('bulkDeleteDemos: Error updating admin templates:', templateError);
        throw new Error(`Failed to update admin templates: ${templateError.message}`);
      }

      // Step 6: Delete user claims
      console.log('bulkDeleteDemos: Deleting user claims...');
      const { error: claimsError } = await supabase
        .from('demo_user_claims')
        .delete()
        .in('demo_site_id', demoIds);

      if (claimsError) {
        console.error('bulkDeleteDemos: Error deleting user claims:', claimsError);
        throw new Error(`Failed to delete user claims: ${claimsError.message}`);
      }

      // Step 7: Finally delete the main demo sites
      console.log('bulkDeleteDemos: Deleting main demo sites...');
      const { error: mainError } = await supabase
        .from('chairlinked_sites')
        .delete()
        .in('id', demoIds)
        .eq('site_type', 'demo');

      if (mainError) {
        console.error('bulkDeleteDemos: Error deleting demo sites:', mainError);
        throw new Error(`Failed to delete demo sites: ${mainError.message}`);
      }

      console.log('bulkDeleteDemos: Successfully deleted all records');

      toast({
        title: "Demos deleted!",
        description: `Successfully deleted ${demoIds.length} demo site${demoIds.length > 1 ? 's' : ''} and all related data`,
        duration: 3000,
      });

    } catch (error) {
      console.error('bulkDeleteDemos: Error during bulk deletion:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete some demo sites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, toast]);

  return {
    bulkDeleteDemos,
    isLoading,
    canPerformOperation: isAdmin && !!user
  };
};

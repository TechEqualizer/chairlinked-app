import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from "@/components/auth/AuthProvider";

interface DemoSite {
  id: string;
  business_name: string;
  site_slug: string;
  prospect_name: string | null;
  prospect_email: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  site_type: string;
  generated_config?: any;
}

export const useDemoOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, user } = useAuthContext();

  const editDemo = async (siteId: string) => {
    console.log('editDemo: Starting edit for site ID:', siteId);
    
    try {
      // Load the full demo data from database
      const { data: demoData, error } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) {
        console.error('editDemo: Error loading demo data:', error);
        throw error;
      }

      console.log('editDemo: Loaded demo data:', {
        id: demoData.id,
        businessName: demoData.business_name,
        hasConfig: !!demoData.generated_config
      });

      // Enhanced session storage structure that matches the new unified session manager
      const editingDemoData = {
        id: demoData.id,
        demoId: demoData.id,
        config: demoData.generated_config || {},
        businessName: demoData.business_name,
        isEditingExisting: true,
        recoveryMetadata: {
          loadSource: 'database',
          recoveryVersion: '3.0',
          savedAt: new Date().toISOString(),
          editMode: true
        }
      };

      // Store session data with multiple keys for better compatibility
      sessionStorage.setItem('editingDemoSite', JSON.stringify(editingDemoData));
      
      // Also store with the session-backup key that the unified session manager looks for
      const sessionBackup = {
        data: demoData.generated_config || {},
        source: 'demo-editing',
        timestamp: Date.now(),
        url: `/template8-generator?mode=edit`,
        searchParams: { mode: 'edit' },
        demoId: demoData.id
      };
      
      sessionStorage.setItem('session-backup', JSON.stringify(sessionBackup));
      
      console.log('editDemo: Enhanced session data stored successfully');
      
      // Navigate directly to the template generator with edit mode
      navigate(`/template8-generator?mode=edit`);
      
    } catch (error) {
      console.error('editDemo: Error preparing demo for editing:', error);
      toast({
        title: "Error",
        description: "Failed to load demo for editing",
        variant: "destructive",
      });
    }
  };

  const deleteDemo = async (siteId: string) => {
    console.log('deleteDemo: Starting delete for site ID:', siteId);
    
    if (!confirm('Are you sure you want to delete this demo?')) {
      console.log('deleteDemo: User cancelled deletion');
      return;
    }

    // Check admin privileges
    if (!isAdmin || !user) {
      console.error('deleteDemo: User not authorized for deletion');
      toast({
        title: "Error",
        description: "You don't have permission to delete demos",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('deleteDemo: Starting transaction-based deletion...');
      
      // Step 1: Delete related prospect leads first (to handle foreign key constraints)
      console.log('deleteDemo: Deleting prospect leads...');
      const { error: prospectError } = await supabase
        .from('demo_prospect_leads')
        .delete()
        .eq('demo_site_id', siteId);

      if (prospectError) {
        console.error('deleteDemo: Error deleting prospect leads:', prospectError);
        throw new Error(`Failed to delete prospect leads: ${prospectError.message}`);
      }

      // Step 2: Delete related traffic records
      console.log('deleteDemo: Deleting traffic records...');
      const { error: trafficError } = await supabase
        .from('chairlinked_traffic')
        .delete()
        .eq('site_id', siteId);

      if (trafficError) {
        console.error('deleteDemo: Error deleting traffic records:', trafficError);
        throw new Error(`Failed to delete traffic records: ${trafficError.message}`);
      }

      // Step 3: Delete engagement records
      console.log('deleteDemo: Deleting engagement records...');
      const { error: engagementError } = await supabase
        .from('chairlinked_engagement')
        .delete()
        .eq('site_id', siteId);

      if (engagementError) {
        console.error('deleteDemo: Error deleting engagement records:', engagementError);
        throw new Error(`Failed to delete engagement records: ${engagementError.message}`);
      }

      // Step 4: Delete button clicks
      console.log('deleteDemo: Deleting button clicks...');
      const { error: clicksError } = await supabase
        .from('button_clicks')
        .delete()
        .eq('site_id', siteId);

      if (clicksError) {
        console.error('deleteDemo: Error deleting button clicks:', clicksError);
        throw new Error(`Failed to delete button clicks: ${clicksError.message}`);
      }

      // Step 5: Update admin templates to remove source_demo_id references
      console.log('deleteDemo: Updating admin templates...');
      const { error: templateError } = await supabase
        .from('admin_templates')
        .update({ source_demo_id: null })
        .eq('source_demo_id', siteId);

      if (templateError) {
        console.error('deleteDemo: Error updating admin templates:', templateError);
        throw new Error(`Failed to update admin templates: ${templateError.message}`);
      }

      // Step 6: Delete user claims
      console.log('deleteDemo: Deleting user claims...');
      const { error: claimsError } = await supabase
        .from('demo_user_claims')
        .delete()
        .eq('demo_site_id', siteId);

      if (claimsError) {
        console.error('deleteDemo: Error deleting user claims:', claimsError);
        throw new Error(`Failed to delete user claims: ${claimsError.message}`);
      }

      // Step 7: Finally delete the main demo site record
      console.log('deleteDemo: Deleting main demo site record...');
      const { error: mainError } = await supabase
        .from('chairlinked_sites')
        .delete()
        .eq('id', siteId);

      if (mainError) {
        console.error('deleteDemo: Error deleting main demo site:', mainError);
        throw new Error(`Failed to delete demo site: ${mainError.message}`);
      }
      
      console.log('deleteDemo: Successfully deleted all records');
      
      toast({
        title: "Demo deleted successfully",
        description: "The demo site and all related data have been removed.",
        duration: 3000,
      });
      
      console.log('deleteDemo: Real-time will handle refresh automatically');
    } catch (error) {
      console.error('deleteDemo: Error during deletion process:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete demo site",
        variant: "destructive",
      });
    }
  };

  return {
    editDemo,
    deleteDemo,
  };
};


import { useState, useCallback } from 'react';
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DemoSavingService } from "@/components/template8/generator/services/DemoSavingService";

export const useDuplicateDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, user } = useAuthContext();
  const { toast } = useToast();

  const duplicateDemo = useCallback(async (originalSiteId: string, expirationHours: number = 168) => { // Default 7 days (168 hours)
    if (!isAdmin || !user) return;

    console.log('duplicateDemo: Starting duplication for site ID:', originalSiteId, 'with expiration hours:', expirationHours);
    setIsLoading(true);
    
    try {
      // Fetch the original demo data
      const { data: originalSite, error: fetchError } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('id', originalSiteId)
        .single();

      if (fetchError) throw fetchError;

      // Generate a unique slug for the duplicate
      const duplicateSlug = await DemoSavingService.generateUniqueSlug(`${originalSite.business_name}-copy`);

      // Calculate expiration date based on selected hours
      const expirationDate = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

      console.log('duplicateDemo: Creating duplicate with expiration:', expirationDate.toISOString());

      // Create duplicate with published status and proper demo metadata
      const { error: insertError } = await supabase
        .from('chairlinked_sites')
        .insert({
          site_slug: duplicateSlug,
          business_name: `${originalSite.business_name} - Copy`,
          generated_config: originalSite.generated_config,
          form_data: originalSite.form_data,
          logo_url: originalSite.logo_url,
          status: 'published', // Ensure demo is immediately accessible
          site_type: 'demo',
          admin_user_id: user.id,
          demo_expires_at: expirationDate.toISOString(),
          demo_view_count: 0,
          demo_engagement_score: 0,
          demo_last_viewed: null
        });

      if (insertError) {
        console.error('duplicateDemo: Insert error:', insertError);
        throw insertError;
      }

      const demoUrl = `${window.location.origin}/site/${duplicateSlug}`;

      console.log('duplicateDemo: Duplicate created successfully with URL:', demoUrl);

      toast({
        title: "Demo duplicated!",
        description: `Demo is live at: ${demoUrl} (expires in ${Math.round(expirationHours/24)} days)`,
        duration: 5000,
      });

      // Copy URL to clipboard for easy sharing
      navigator.clipboard.writeText(demoUrl).catch(err => 
        console.log('duplicateDemo: Could not copy to clipboard:', err)
      );

    } catch (error) {
      console.error('duplicateDemo: Error duplicating demo:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate demo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, toast]);

  return {
    duplicateDemo,
    isLoading,
    canPerformOperation: isAdmin && !!user
  };
};

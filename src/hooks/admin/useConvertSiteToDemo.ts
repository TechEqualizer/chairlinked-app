
import { useState, useCallback } from 'react';
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DemoSavingService } from "@/components/template8/generator/services/DemoSavingService";

export const useConvertSiteToDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, user } = useAuthContext();
  const { toast } = useToast();

  const convertSiteToDemo = useCallback(async (siteId: string, expirationHours: number = 168) => { // Default 7 days (168 hours)
    if (!isAdmin || !user) return;

    console.log('convertSiteToDemo: Starting conversion for site ID:', siteId, 'with expiration hours:', expirationHours);
    setIsLoading(true);
    
    try {
      // Fetch the existing site data
      const { data: site, error: fetchError } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (fetchError) throw fetchError;

      // Generate a unique demo slug
      const demoSlug = await DemoSavingService.generateUniqueSlug(`demo-${site.business_name}`);

      // Calculate expiration date based on selected hours
      const expirationDate = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

      console.log('convertSiteToDemo: Creating demo with expiration:', expirationDate.toISOString());

      // Create demo version with published status and proper demo metadata
      const { error: insertError } = await supabase
        .from('chairlinked_sites')
        .insert({
          site_slug: demoSlug,
          business_name: `Demo - ${site.business_name}`,
          generated_config: site.generated_config,
          form_data: site.form_data,
          logo_url: site.logo_url,
          status: 'published', // Ensure demo is published and accessible
          site_type: 'demo',
          admin_user_id: user.id,
          demo_expires_at: expirationDate.toISOString(),
          demo_view_count: 0,
          demo_engagement_score: 0,
          demo_last_viewed: null
        });

      if (insertError) {
        console.error('convertSiteToDemo: Insert error:', insertError);
        throw insertError;
      }

      const demoUrl = `${window.location.origin}/site/${demoSlug}`;

      console.log('convertSiteToDemo: Demo created successfully with URL:', demoUrl);

      toast({
        title: "Demo site created!",
        description: `Demo is live at: ${demoUrl} (expires in ${Math.round(expirationHours/24)} days)`,
        duration: 5000,
      });

      // Copy to clipboard for easy sharing
      navigator.clipboard.writeText(demoUrl).catch(err => 
        console.log('convertSiteToDemo: Could not copy to clipboard:', err)
      );

    } catch (error) {
      console.error('convertSiteToDemo: Error converting site to demo:', error);
      toast({
        title: "Error",
        description: "Failed to create demo site",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, toast]);

  return {
    convertSiteToDemo,
    isLoading,
    canPerformOperation: isAdmin && !!user
  };
};

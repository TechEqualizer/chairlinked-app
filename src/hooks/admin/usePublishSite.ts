
import { useState, useCallback } from 'react';
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePublishSite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, user } = useAuthContext();
  const { toast } = useToast();

  const publishSite = useCallback(async (siteId: string) => {
    if (!isAdmin || !user) return { success: false };

    console.log('publishSite: Starting publish for site ID:', siteId);
    setIsLoading(true);
    
    try {
      // Update the site to published status
      const { data: updatedSite, error } = await supabase
        .from('chairlinked_sites')
        .update({
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', siteId)
        .select()
        .single();

      if (error) {
        console.error('publishSite: Error updating site:', error);
        throw error;
      }

      const siteUrl = `${window.location.origin}/site/${updatedSite.site_slug}`;
      const customerUrl = `https://chairlinked.com/${updatedSite.site_slug}`;

      console.log('publishSite: Site published successfully:', {
        siteId,
        siteUrl,
        customerUrl,
        siteType: updatedSite.site_type
      });

      toast({
        title: "Site published successfully!",
        description: updatedSite.site_type === 'demo' 
          ? `Demo is now live at: ${customerUrl}`
          : `Customer site is live at: ${customerUrl}`,
        duration: 5000,
      });

      // Copy customer URL to clipboard
      navigator.clipboard.writeText(customerUrl).catch(err => 
        console.log('publishSite: Could not copy to clipboard:', err)
      );

      return { success: true, customerUrl, siteType: updatedSite.site_type };

    } catch (error) {
      console.error('publishSite: Error publishing site:', error);
      toast({
        title: "Error",
        description: "Failed to publish site",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, toast]);

  const convertToLive = useCallback(async (siteId: string) => {
    if (!isAdmin || !user) return { success: false };

    console.log('convertToLive: Converting demo to live site:', siteId);
    setIsLoading(true);
    
    try {
      const { data: updatedSite, error } = await supabase
        .from('chairlinked_sites')
        .update({
          site_type: 'live',
          status: 'published',
          demo_expires_at: null,
          demo_view_count: null,
          demo_engagement_score: null,
          demo_last_viewed: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', siteId)
        .select()
        .single();

      if (error) {
        console.error('convertToLive: Error converting site:', error);
        throw error;
      }

      const customerUrl = `https://chairlinked.com/${updatedSite.site_slug}`;

      console.log('convertToLive: Site converted successfully:', {
        siteId,
        customerUrl
      });

      toast({
        title: "Site converted to live!",
        description: `Customer site is now live at: ${customerUrl}`,
        duration: 5000,
      });

      navigator.clipboard.writeText(customerUrl).catch(err => 
        console.log('convertToLive: Could not copy to clipboard:', err)
      );

      return { success: true, customerUrl };

    } catch (error) {
      console.error('convertToLive: Error converting site:', error);
      toast({
        title: "Error",
        description: "Failed to convert site to live",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, toast]);

  return {
    publishSite,
    convertToLive,
    isLoading,
    canPerformOperation: isAdmin && !!user
  };
};

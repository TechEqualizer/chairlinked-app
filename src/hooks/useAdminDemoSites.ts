
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SiteWithLifecycle } from '@/types/siteLifecycle';

export const useAdminDemoSites = () => {
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  
  // Mock data for development
  const mockSites: SiteWithLifecycle[] = [
    {
      id: 'demo-1',
      business_name: 'Beauty Studio Demo',
      site_slug: 'beauty-studio-demo',
      prospect_name: 'Jane Smith',
      prospect_email: 'jane@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      site_type: 'demo',
      lifecycle_stage: 'shared',
      demo_view_count: 5,
      demo_last_viewed: new Date().toISOString(),
      generated_config: { businessName: 'Beauty Studio Demo' },
    },
    {
      id: 'demo-2',
      business_name: 'Hair Salon Demo',
      site_slug: 'hair-salon-demo',
      prospect_name: 'John Doe',
      prospect_email: 'john@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      site_type: 'demo',
      lifecycle_stage: 'claimed',
      demo_view_count: 12,
      demo_last_viewed: new Date().toISOString(),
      generated_config: { businessName: 'Hair Salon Demo' },
    },
    {
      id: 'live-1',
      business_name: 'Pink Fin Beauty',
      site_slug: 'pinkfinbeauty',
      prospect_name: null,
      prospect_email: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      site_type: 'live',
      lifecycle_stage: 'live_published',
      generated_config: { businessName: 'Pink Fin Beauty' },
    }
  ];

  const [demoSites, setDemoSites] = useState<SiteWithLifecycle[]>(
    isDevMode ? mockSites.filter(s => s.site_type === 'demo') : []
  );
  const [allSites, setAllSites] = useState<SiteWithLifecycle[]>(
    isDevMode ? mockSites : []
  );
  const [loading, setLoading] = useState(isDevMode ? false : true);
  const { toast } = useToast();

  const loadSites = async () => {
    console.log('loadSites: Starting to load all sites with lifecycle data...');
    
    // Skip database calls in dev mode
    if (isDevMode) {
      console.log('loadSites: Dev mode - using mock data');
      setDemoSites(mockSites.filter(s => s.site_type === 'demo'));
      setAllSites(mockSites);
      setLoading(false);
      return;
    }
    
    try {
      // Load ALL sites with lifecycle information
      const { data: allSitesData, error: allSitesError } = await supabase
        .from('chairlinked_sites')
        .select(`
          *,
          lifecycle_stage,
          shared_at,
          payment_initiated_at,
          payment_completed_at,
          customer_control_granted_at
        `)
        .order('updated_at', { ascending: false });

      if (allSitesError) {
        console.error('loadSites: Error loading all sites:', allSitesError);
        throw allSitesError;
      }
      
      console.log('loadSites: Loaded all sites:', allSitesData?.length || 0);
      
      // Log lifecycle stage distribution
      const stageDistribution = allSitesData?.reduce((acc, site) => {
        const stage = site.lifecycle_stage || 'unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('loadSites: Lifecycle stage distribution:', stageDistribution);
      
      // Separate demo sites for backward compatibility
      const demoOnly = allSitesData?.filter(site => site.site_type === 'demo') || [];
      setDemoSites(demoOnly as SiteWithLifecycle[]);
      
      // Set all sites for unified management
      setAllSites(allSitesData as SiteWithLifecycle[] || []);
      
    } catch (error) {
      console.error('loadSites: Error in loadSites function:', error);
      toast({
        title: "Error loading sites",
        description: "Failed to load sites. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
    
    // Skip real-time subscriptions in dev mode
    if (isDevMode) {
      return;
    }
    
    // Set up real-time subscription for chairlinked_sites changes with throttling
    console.log('loadSites: Setting up real-time subscription with lifecycle tracking');
    let debounceTimer: NodeJS.Timeout;
    
    const channel = supabase
      .channel('chairlinked_sites_lifecycle_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chairlinked_sites'
        },
        (payload) => {
          console.log('loadSites: Real-time lifecycle update received:', payload);
          // Debounce rapid updates to prevent flickering
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            loadSites();
          }, 1000); // Wait 1 second before reloading
        }
      )
      .subscribe();

    return () => {
      console.log('loadSites: Cleaning up lifecycle real-time subscription');
      clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [isDevMode]);

  return {
    demoSites,
    allSites,
    loading,
    loadSites,
  };
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SitePerformanceData {
  id: string;
  business_name: string;
  site_slug: string;
  demo_view_count: number;
  uniqueVisitors: number;
  totalClicks: number;
  engagementRate: number;
}

export const useSitePerformanceAnalytics = () => {
  return useQuery({
    queryKey: ['site-performance-analytics'],
    queryFn: async (): Promise<SitePerformanceData[]> => {
      // Get all demo sites
      const { data: sites, error: sitesError } = await supabase
        .from('chairlinked_sites')
        .select('id, business_name, site_slug, demo_view_count')
        .eq('site_type', 'demo')
        .eq('status', 'published');

      if (sitesError) throw sitesError;
      if (!sites) return [];

      // Get traffic data for each site
      const { data: trafficData, error: trafficError } = await supabase
        .from('chairlinked_traffic')
        .select('site_id, visitor_identifier');

      if (trafficError) throw trafficError;

      // Get button click data for each site
      const { data: clickData, error: clickError } = await supabase
        .from('button_clicks')
        .select('site_id, visitor_id');

      if (clickError) throw clickError;

      // Calculate performance metrics for each site
      const performanceData: SitePerformanceData[] = sites.map(site => {
        // Count unique visitors for this site
        const siteTraffic = trafficData?.filter(t => t.site_id === site.id) || [];
        const uniqueVisitors = new Set(siteTraffic.map(t => t.visitor_identifier)).size;

        // Count total clicks for this site
        const siteClicks = clickData?.filter(c => c.site_id === site.id) || [];
        const totalClicks = siteClicks.length;

        // Calculate engagement rate (clicks per visitor as percentage)
        const engagementRate = uniqueVisitors > 0 ? (totalClicks / uniqueVisitors) * 100 : 0;

        return {
          id: site.id,
          business_name: site.business_name,
          site_slug: site.site_slug,
          demo_view_count: site.demo_view_count || 0,
          uniqueVisitors,
          totalClicks,
          engagementRate: Math.round(engagementRate * 10) / 10 // Round to 1 decimal
        };
      });

      // Sort by engagement rate (highest first)
      return performanceData.sort((a, b) => b.engagementRate - a.engagementRate);
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

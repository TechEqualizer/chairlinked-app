
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteMetrics {
  totalViews: number;
  monthlyViews: number;
  uniqueVisitors: number;
  engagementScore: number;
  monthlyGrowth?: number;
}

export const useSiteMetrics = (siteId: string) => {
  const [metrics, setMetrics] = useState<SiteMetrics>({
    totalViews: 0,
    monthlyViews: 0,
    uniqueVisitors: 0,
    engagementScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!siteId) {
        setLoading(false);
        return;
      }

      try {
        // Get traffic data
        const { data: trafficData, error: trafficError } = await supabase
          .from('chairlinked_traffic')
          .select('visit_count, visitor_identifier, first_visit')
          .eq('site_id', siteId);

        if (trafficError) throw trafficError;

        // Get engagement data
        const { data: engagementData, error: engagementError } = await supabase
          .from('chairlinked_engagement')
          .select('hearts, comments, saves, traffic_score')
          .eq('site_id', siteId)
          .single();

        if (engagementError && engagementError.code !== 'PGRST116') {
          console.warn('No engagement data found for site:', siteId);
        }

        // Calculate metrics
        const totalViews = trafficData?.reduce((sum, visit) => sum + visit.visit_count, 0) || 0;
        const uniqueVisitors = new Set(trafficData?.map(visit => visit.visitor_identifier)).size;
        
        // Calculate monthly views (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const monthlyViews = trafficData?.filter(visit => 
          new Date(visit.first_visit) > thirtyDaysAgo
        ).reduce((sum, visit) => sum + visit.visit_count, 0) || 0;

        // Calculate engagement score
        const engagementScore = engagementData ? 
          (engagementData.hearts + engagementData.comments + engagementData.saves) : 0;

        setMetrics({
          totalViews,
          monthlyViews,
          uniqueVisitors,
          engagementScore
        });
      } catch (error) {
        console.error('Error fetching site metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [siteId]);

  return { metrics, loading };
};

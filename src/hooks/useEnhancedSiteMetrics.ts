import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFakeEngagementMetrics, getEngagementInsights, generateTimeSeriesData } from '@/services/fakeEngagementMetrics';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface EnhancedSiteMetrics {
  // Core metrics
  totalViews: number;
  monthlyViews: number;
  uniqueVisitors: number;
  engagementScore: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
  
  // Action metrics
  bookingClicks: number;
  contactClicks: number;
  socialEngagement: number;
  averageSessionTime: string;
  
  // Traffic analysis
  topTrafficSources: Array<{ source: string; percentage: number }>;
  hourlyViews: Array<{ hour: number; views: number }>;
  
  // Demographics
  demographicData: {
    ageGroups: Array<{ group: string; percentage: number }>;
    gender: Array<{ type: string; percentage: number }>;
    devices: Array<{ type: string; percentage: number }>;
  };
  
  // Time series data for charts
  timeSeriesData: Array<{
    date: string;
    views: number;
    visitors: number;
    engagement: number;
  }>;
  
  // Encouraging insights
  insights: string[];
  
  // Performance indicators
  performanceGrade: 'A' | 'B' | 'C' | 'D';
  performanceMessage: string;
}

export const useEnhancedSiteMetrics = (siteId: string, businessName?: string) => {
  const { isAdmin } = useAuthContext();
  const [metrics, setMetrics] = useState<EnhancedSiteMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!siteId) {
        setLoading(false);
        return;
      }

      try {
        // For admin users, try to get real metrics first, then fall back to fake metrics
        // For customers, always use encouraging fake metrics
        let shouldUseFakeMetrics = !isAdmin;
        let realMetrics = null;

        if (isAdmin) {
          try {
            // Try to fetch real metrics for admin users
            const { data: trafficData } = await supabase
              .from('chairlinked_traffic')
              .select('visit_count, visitor_identifier, first_visit')
              .eq('site_id', siteId);

            const { data: engagementData } = await supabase
              .from('chairlinked_engagement')
              .select('hearts, comments, saves, traffic_score')
              .eq('site_id', siteId)
              .single();

            if (trafficData && trafficData.length > 0) {
              // Calculate real metrics
              const totalViews = trafficData.reduce((sum, visit) => sum + visit.visit_count, 0);
              const uniqueVisitors = new Set(trafficData.map(visit => visit.visitor_identifier)).size;
              
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              
              const monthlyViews = trafficData.filter(visit => 
                new Date(visit.first_visit) > thirtyDaysAgo
              ).reduce((sum, visit) => sum + visit.visit_count, 0);

              const engagementScore = engagementData ? 
                (engagementData.hearts + engagementData.comments + engagementData.saves) : 0;

              realMetrics = {
                totalViews,
                monthlyViews,
                uniqueVisitors,
                engagementScore
              };

              // Only use real metrics if there's meaningful data
              if (totalViews > 0) {
                shouldUseFakeMetrics = false;
              }
            }
          } catch (error) {
            console.log('Real metrics not available, using fake metrics');
            shouldUseFakeMetrics = true;
          }
        }

        if (shouldUseFakeMetrics) {
          // Generate encouraging fake metrics
          const fakeMetrics = getFakeEngagementMetrics(siteId, businessName);
          const timeSeriesData = generateTimeSeriesData(siteId);
          const insights = getEngagementInsights(fakeMetrics);
          
          // Calculate performance grade based on metrics
          const performanceGrade = calculatePerformanceGrade(fakeMetrics);
          const performanceMessage = getPerformanceMessage(performanceGrade, fakeMetrics);

          setMetrics({
            ...fakeMetrics,
            timeSeriesData,
            insights,
            performanceGrade,
            performanceMessage
          });
        } else if (realMetrics) {
          // Use real metrics but enhance them with fake additional data for better UX
          const fakeEnhancements = getFakeEngagementMetrics(siteId, businessName);
          const timeSeriesData = generateTimeSeriesData(siteId);
          
          const enhancedMetrics: EnhancedSiteMetrics = {
            // Use real core metrics
            totalViews: realMetrics.totalViews,
            monthlyViews: realMetrics.monthlyViews,
            uniqueVisitors: realMetrics.uniqueVisitors,
            engagementScore: realMetrics.engagementScore,
            
            // Use fake metrics for encouraging additional data
            monthlyGrowth: fakeEnhancements.monthlyGrowth,
            weeklyGrowth: fakeEnhancements.weeklyGrowth,
            bookingClicks: Math.min(fakeEnhancements.bookingClicks, realMetrics.engagementScore),
            contactClicks: Math.min(fakeEnhancements.contactClicks, realMetrics.engagementScore),
            socialEngagement: Math.min(fakeEnhancements.socialEngagement, realMetrics.engagementScore),
            averageSessionTime: fakeEnhancements.averageSessionTime,
            topTrafficSources: fakeEnhancements.topTrafficSources,
            hourlyViews: fakeEnhancements.hourlyViews,
            demographicData: fakeEnhancements.demographicData,
            timeSeriesData,
            insights: getEngagementInsights({
              ...realMetrics,
              ...fakeEnhancements
            }),
            performanceGrade: calculatePerformanceGrade(fakeEnhancements),
            performanceMessage: getPerformanceMessage(calculatePerformanceGrade(fakeEnhancements), fakeEnhancements)
          };

          setMetrics(enhancedMetrics);
        }
      } catch (error) {
        console.error('Error fetching enhanced site metrics:', error);
        
        // Fallback to fake metrics on any error
        const fakeMetrics = getFakeEngagementMetrics(siteId, businessName);
        const timeSeriesData = generateTimeSeriesData(siteId);
        const insights = getEngagementInsights(fakeMetrics);
        const performanceGrade = calculatePerformanceGrade(fakeMetrics);
        
        setMetrics({
          ...fakeMetrics,
          timeSeriesData,
          insights,
          performanceGrade,
          performanceMessage: getPerformanceMessage(performanceGrade, fakeMetrics)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [siteId, businessName, isAdmin]);

  return { metrics, loading };
};

/**
 * Calculate performance grade based on metrics
 */
const calculatePerformanceGrade = (metrics: any): 'A' | 'B' | 'C' | 'D' => {
  const score = (
    (metrics.monthlyGrowth || 0) * 0.3 +
    (metrics.engagementScore / Math.max(metrics.totalViews, 1)) * 100 * 0.4 +
    (metrics.bookingClicks / Math.max(metrics.totalViews, 1)) * 100 * 0.3
  );

  if (score >= 25) return 'A';
  if (score >= 15) return 'B';
  if (score >= 8) return 'C';
  return 'D';
};

/**
 * Get encouraging performance message
 */
const getPerformanceMessage = (grade: string, metrics: any): string => {
  const messages = {
    A: "🌟 Outstanding performance! Your site is attracting and engaging visitors exceptionally well.",
    B: "✨ Great work! Your site is performing well with solid visitor engagement.",
    C: "📈 Good progress! Your site is building momentum and attracting new visitors.",
    D: "🚀 Getting started! Your professional site is ready to attract more visitors."
  };

  return messages[grade as keyof typeof messages] || messages.C;
};
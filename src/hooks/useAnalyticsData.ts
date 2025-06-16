
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

// Mock data for development mode
const getMockAnalytics = () => ({
  siteStats: {
    totalSites: 12,
    demoSites: 8,
    liveSites: 4,
    publishedSites: 4,
    totalViews: 1847,
    sites: []
  },
  trafficStats: {
    uniqueVisitors: 234,
    totalVisits: 456,
    recentVisitors: 28,
    visits: []
  },
  clickStats: {
    totalClicks: 89,
    uniqueClickers: 45,
    clicksByType: { cta: 34, contact: 25, booking: 30 },
    clickRate: 38.0,
    clicks: []
  },
  leadStats: {
    totalLeads: 23,
    conversionRate: 9.8,
    leads: []
  }
});

export const useAnalyticsData = () => {
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  const [mockData] = useState(getMockAnalytics);

  // In dev mode, return mock data immediately without loading states
  if (isDevMode) {
    return {
      siteStats: mockData.siteStats,
      trafficStats: mockData.trafficStats,
      clickStats: mockData.clickStats,
      leadStats: mockData.leadStats,
      isLoading: false
    };
  }

  // Fetch site statistics
  const { data: siteStats, isLoading: siteStatsLoading } = useQuery({
    queryKey: ['analytics-site-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chairlinked_sites')
        .select('id, site_type, status, demo_view_count, business_name, created_at');
      
      if (error) throw error;
      
      const totalSites = data.length;
      const demoSites = data.filter(site => site.site_type === 'demo').length;
      const liveSites = data.filter(site => site.site_type === 'live').length;
      const publishedSites = data.filter(site => site.status === 'published').length;
      const totalViews = data.reduce((sum, site) => sum + (site.demo_view_count || 0), 0);
      
      return {
        totalSites,
        demoSites,
        liveSites,
        publishedSites,
        totalViews,
        sites: data
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes instead of 30 seconds
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    retry: 1, // Only retry once on error
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });

  // Fetch traffic data
  const { data: trafficStats, isLoading: trafficLoading } = useQuery({
    queryKey: ['analytics-traffic-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chairlinked_traffic')
        .select('id, site_id, visitor_identifier, visit_count, first_visit, last_visit');
      
      if (error) throw error;
      
      const uniqueVisitors = data.length;
      const totalVisits = data.reduce((sum, visit) => sum + visit.visit_count, 0);
      
      // Calculate recent visitors (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentVisitors = data.filter(visit => 
        new Date(visit.last_visit) > yesterday
      ).length;
      
      return {
        uniqueVisitors,
        totalVisits,
        recentVisitors,
        visits: data
      };
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch button click data
  const { data: clickStats, isLoading: clickLoading } = useQuery({
    queryKey: ['analytics-click-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('button_clicks')
        .select('id, site_id, button_type, button_label, section, clicked_at, visitor_id');
      
      if (error) throw error;
      
      const totalClicks = data.length;
      const uniqueClickers = new Set(data.map(click => click.visitor_id)).size;
      
      // Group by button type
      const clicksByType = data.reduce((acc, click) => {
        acc[click.button_type] = (acc[click.button_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Calculate click rate (clicks per visitor)
      const clickRate = trafficStats?.uniqueVisitors 
        ? ((totalClicks / trafficStats.uniqueVisitors) * 100).toFixed(1)
        : '0';
      
      return {
        totalClicks,
        uniqueClickers,
        clicksByType,
        clickRate: parseFloat(clickRate),
        clicks: data
      };
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch prospect leads for conversion rate
  const { data: leadStats, isLoading: leadLoading } = useQuery({
    queryKey: ['analytics-lead-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demo_prospect_leads')
        .select('id, demo_site_id, claimed_at, name, email');
      
      if (error) throw error;
      
      const totalLeads = data.length;
      const conversionRate = trafficStats?.uniqueVisitors 
        ? ((totalLeads / trafficStats.uniqueVisitors) * 100).toFixed(1)
        : '0';
      
      return {
        totalLeads,
        conversionRate: parseFloat(conversionRate),
        leads: data
      };
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const isLoading = siteStatsLoading || trafficLoading || clickLoading || leadLoading;

  return {
    siteStats,
    trafficStats,
    clickStats,
    leadStats,
    isLoading
  };
};

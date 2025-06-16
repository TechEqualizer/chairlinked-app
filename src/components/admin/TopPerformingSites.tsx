
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSitePerformanceAnalytics } from '@/hooks/useSitePerformanceAnalytics';
import { TrendingUp, Eye, Users, MousePointerClick, ExternalLink } from 'lucide-react';

export const TopPerformingSites: React.FC = () => {
  const { data: sitePerformance, isLoading, error } = useSitePerformanceAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Top Performing Demo Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Top Performing Demo Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Error loading site performance data</p>
        </CardContent>
      </Card>
    );
  }

  if (!sitePerformance || sitePerformance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Top Performing Demo Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No demo sites with performance data yet</p>
        </CardContent>
      </Card>
    );
  }

  // Show top 5 performing sites
  const topSites = sitePerformance.slice(0, 5);

  const handlePreviewSite = (siteSlug: string) => {
    const previewUrl = `https://chairlinked.com/${siteSlug}`;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Top Performing Demo Sites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topSites.map((site, index) => (
            <div
              key={site.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {site.business_name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {site.demo_view_count} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {site.uniqueVisitors} visitors
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {site.totalClicks} clicks
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-lg text-purple-600">
                    {site.engagementRate}%
                  </p>
                  <p className="text-xs text-gray-500">engagement</p>
                </div>
                <button
                  onClick={() => handlePreviewSite(site.site_slug)}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Preview site"
                  aria-label={`Preview ${site.business_name} site`}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {sitePerformance.length > 5 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing top 5 of {sitePerformance.length} demo sites
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

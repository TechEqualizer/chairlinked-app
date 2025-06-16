
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteMetrics } from '@/hooks/useSiteMetrics';
import { TrendingUp, Users, MousePointer, Heart } from 'lucide-react';

interface SiteMetricsSectionProps {
  siteId: string;
}

export const SiteMetricsSection: React.FC<SiteMetricsSectionProps> = ({ siteId }) => {
  const { metrics, loading } = useSiteMetrics(siteId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Site Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-800">
              {metrics.totalViews || 0}
            </p>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-800">
              {metrics.monthlyViews || 0}
            </p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <MousePointer className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-800">
              {metrics.uniqueVisitors || 0}
            </p>
            <p className="text-sm text-gray-600">Unique Visitors</p>
          </div>
          
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <Heart className="w-6 h-6 mx-auto mb-2 text-pink-600" />
            <p className="text-2xl font-bold text-pink-800">
              {metrics.engagementScore || 0}
            </p>
            <p className="text-sm text-gray-600">Engagement</p>
          </div>
        </div>
        
        {metrics.monthlyGrowth !== undefined && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Growth vs. last month: 
              <span className={`ml-2 font-semibold ${
                metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth}%
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

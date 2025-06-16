
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useSiteMetrics } from '@/hooks/useSiteMetrics';

interface MetricsCardsProps {
  siteId?: string;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ siteId }) => {
  const { metrics, loading } = useSiteMetrics(siteId || '');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: 'Visits',
      value: metrics.totalViews || 0,
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Bookings',
      value: metrics.engagementScore || 0,
      change: '+8%',
      isPositive: true,
    },
    {
      title: 'Conversion',
      value: `${((metrics.engagementScore / Math.max(metrics.totalViews, 1)) * 100).toFixed(1)}%`,
      change: '+2.4%',
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center gap-1">
                {metric.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

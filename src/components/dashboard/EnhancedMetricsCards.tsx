import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, MousePointer, Calendar, Clock, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useEnhancedSiteMetrics } from '@/hooks/useEnhancedSiteMetrics';

interface EnhancedMetricsCardsProps {
  siteId?: string;
  businessName?: string;
}

export const EnhancedMetricsCards: React.FC<EnhancedMetricsCardsProps> = ({ 
  siteId, 
  businessName 
}) => {
  const { metrics, loading } = useEnhancedSiteMetrics(siteId || '', businessName);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading state */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const primaryMetrics = [
    {
      title: 'Total Visits',
      value: metrics.totalViews.toLocaleString(),
      change: `+${metrics.monthlyGrowth}%`,
      isPositive: true,
      icon: <Users className="w-5 h-5" />,
      description: 'All-time visitors'
    },
    {
      title: 'This Month',
      value: metrics.monthlyViews.toLocaleString(),
      change: `+${metrics.weeklyGrowth}%`,
      isPositive: true,
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Monthly visitors'
    },
    {
      title: 'Booking Clicks',
      value: metrics.bookingClicks.toLocaleString(),
      change: '+15%',
      isPositive: true,
      icon: <Calendar className="w-5 h-5" />,
      description: 'Potential customers'
    },
    {
      title: 'Avg. Session',
      value: metrics.averageSessionTime,
      change: '+12%',
      isPositive: true,
      icon: <Clock className="w-5 h-5" />,
      description: 'Time on site'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Grade Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  metrics.performanceGrade === 'A' ? 'bg-green-500' :
                  metrics.performanceGrade === 'B' ? 'bg-blue-500' :
                  metrics.performanceGrade === 'C' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}>
                  {metrics.performanceGrade}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Site Performance</h3>
              </div>
              <p className="text-gray-600">{metrics.performanceMessage}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.uniqueVisitors}
              </div>
              <div className="text-sm text-gray-600">unique visitors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryMetrics.map((metric) => (
          <Card key={metric.title} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  {metric.icon}
                </div>
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
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Section */}
      {metrics.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.insights.map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traffic Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topTrafficSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-purple-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  </div>
                  <span className="text-sm text-gray-600">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.demographicData.devices.map((device) => {
                const Icon = device.type === 'Mobile' ? Smartphone : 
                           device.type === 'Desktop' ? Monitor : Tablet;
                
                return (
                  <div key={device.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{device.type}</span>
                    </div>
                    <span className="text-sm text-gray-600">{device.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {metrics.bookingClicks}
            </div>
            <div className="text-sm text-green-600 font-medium">Booking Interest</div>
            <div className="text-xs text-green-600 mt-1">People clicked your booking button</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {metrics.contactClicks}
            </div>
            <div className="text-sm text-blue-600 font-medium">Contact Clicks</div>
            <div className="text-xs text-blue-600 mt-1">People wanted to reach you</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {metrics.socialEngagement}
            </div>
            <div className="text-sm text-purple-600 font-medium">Social Shares</div>
            <div className="text-xs text-purple-600 mt-1">People shared your content</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
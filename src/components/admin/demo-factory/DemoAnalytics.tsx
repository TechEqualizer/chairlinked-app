import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter
} from 'lucide-react';
import { useAdminDemoSites } from '@/hooks/useAdminDemoSites';

export const DemoAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { demoSites, loading } = useAdminDemoSites();

  // Calculate analytics metrics
  const totalDemos = demoSites?.length || 0;
  const liveDemos = demoSites?.filter(site => 
    site.lifecycle_stage === 'ready_to_share' || site.lifecycle_stage === 'shared'
  ).length || 0;
  const claimedDemos = demoSites?.filter(site => 
    site.lifecycle_stage === 'claimed' || site.lifecycle_stage === 'customer_controlled'
  ).length || 0;
  const conversionRate = totalDemos > 0 ? ((claimedDemos / totalDemos) * 100) : 0;

  // Mock revenue calculation
  const estimatedRevenue = claimedDemos * 97 + (claimedDemos * 5.99 * 6);
  const revenueGrowth = 23.5; // Mock growth percentage

  // Industry performance breakdown
  const industryData = [
    { industry: 'Hair Salons', demos: Math.floor(totalDemos * 0.3), claims: Math.floor(claimedDemos * 0.35), revenue: '$12,450' },
    { industry: 'Beauty & Makeup', demos: Math.floor(totalDemos * 0.25), claims: Math.floor(claimedDemos * 0.3), revenue: '$9,870' },
    { industry: 'Photography', demos: Math.floor(totalDemos * 0.2), claims: Math.floor(claimedDemos * 0.2), revenue: '$7,280' },
    { industry: 'Fitness & Wellness', demos: Math.floor(totalDemos * 0.15), claims: Math.floor(claimedDemos * 0.1), revenue: '$3,640' },
    { industry: 'Other Services', demos: Math.floor(totalDemos * 0.1), claims: Math.floor(claimedDemos * 0.05), revenue: '$1,820' }
  ];

  // Top performing demos (mock data)
  const topPerformingDemos = [
    { name: 'Bella Luxury Studio', industry: 'Hair Salon', claims: 12, conversionRate: 35.3, revenue: '$1,164' },
    { name: 'Radiant Beauty Spa', industry: 'Beauty & Makeup', claims: 8, conversionRate: 28.6, revenue: '$776' },
    { name: 'Urban Edge Salon', industry: 'Hair Salon', claims: 6, conversionRate: 25.0, revenue: '$582' },
    { name: 'Artisan Portrait Studio', industry: 'Photography', claims: 5, conversionRate: 22.7, revenue: '$485' },
    { name: 'Elite Fitness Studio', industry: 'Fitness', claims: 4, conversionRate: 20.0, revenue: '$388' }
  ];

  // Monthly trends (mock data)
  const monthlyTrends = [
    { month: 'Jan', demos: 15, claims: 3, revenue: 1164 },
    { month: 'Feb', demos: 22, claims: 5, revenue: 1940 },
    { month: 'Mar', demos: 28, claims: 8, revenue: 3104 },
    { month: 'Apr', demos: 35, claims: 12, revenue: 4656 },
    { month: 'May', demos: 42, claims: 15, revenue: 5820 },
    { month: 'Jun', demos: 48, claims: 18, revenue: 6984 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(estimatedRevenue),
      change: `+${revenueGrowth}%`,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+2.4%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Total Claims',
      value: claimedDemos,
      change: '+15',
      trend: 'up',
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Active Demos',
      value: liveDemos,
      change: '+8',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Demo Analytics</h2>
          <p className="text-gray-600 mt-1">
            Track performance and optimize your demo conversion rates
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((month, index) => {
                const conversionRate = month.demos > 0 ? ((month.claims / month.demos) * 100).toFixed(1) : '0';
                return (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-900">{month.month}</div>
                      <Badge variant="secondary">{month.demos} demos</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-green-600">{month.claims} claims</div>
                      <div className="text-blue-600">{conversionRate}%</div>
                      <div className="font-medium">{formatCurrency(month.revenue)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Industry Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Industry Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {industryData.map((industry) => {
                const conversionRate = industry.demos > 0 ? ((industry.claims / industry.demos) * 100).toFixed(1) : '0';
                return (
                  <div key={industry.industry} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{industry.industry}</h4>
                      <p className="text-sm text-gray-600">
                        {industry.demos} demos • {industry.claims} claims
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{industry.revenue}</div>
                      <div className="text-sm text-gray-600">{conversionRate}% conversion</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Demos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Performing Demos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingDemos.map((demo, index) => (
              <div key={demo.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{demo.name}</h4>
                    <p className="text-sm text-gray-600">{demo.industry}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{demo.claims}</div>
                    <div className="text-gray-600">Claims</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{demo.conversionRate}%</div>
                    <div className="text-gray-600">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{demo.revenue}</div>
                    <div className="text-gray-600">Revenue</div>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    View Demo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="w-5 h-5" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-900">Top Performing Strategies</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hair salon demos convert 35% better than average</li>
                <li>• Luxury branding increases claim rates by 28%</li>
                <li>• Professional photography boosts conversions</li>
                <li>• Mobile-optimized demos perform 22% better</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-blue-900">Optimization Opportunities</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Create more fitness & wellness demo variations</li>
                <li>• Test different pricing displays on service cards</li>
                <li>• Add social proof elements to increase trust</li>
                <li>• A/B test hero section layouts for better engagement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
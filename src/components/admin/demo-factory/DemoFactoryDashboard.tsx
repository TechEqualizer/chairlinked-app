import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Factory, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Plus, 
  Eye, 
  Settings, 
  BarChart3,
  Zap,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { useAdminDemoSites } from '@/hooks/useAdminDemoSites';

interface DemoFactoryDashboardProps {
  onCreateDemo: () => void;
  onManageTemplates: () => void;
  onViewAnalytics: () => void;
}

export const DemoFactoryDashboard: React.FC<DemoFactoryDashboardProps> = ({
  onCreateDemo,
  onManageTemplates,
  onViewAnalytics
}) => {
  const { demoSites, loading } = useAdminDemoSites();
  
  // Calculate demo factory metrics
  const totalDemos = demoSites?.length || 0;
  const liveProspectingDemos = demoSites?.filter(site => 
    site.lifecycle_stage === 'ready_to_share' || site.lifecycle_stage === 'shared'
  ).length || 0;
  const claimedDemos = demoSites?.filter(site => 
    site.lifecycle_stage === 'claimed' || site.lifecycle_stage === 'customer_controlled'
  ).length || 0;
  const conversionRate = totalDemos > 0 ? ((claimedDemos / totalDemos) * 100).toFixed(1) : '0';

  // Demo production metrics
  const demosThisWeek = demoSites?.filter(site => {
    const created = new Date(site.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  }).length || 0;

  // Calculate estimated revenue (claimed demos * $97 setup + estimated monthly)
  const estimatedRevenue = claimedDemos * 97 + (claimedDemos * 5.99 * 6); // Assume $5.99 avg plan for 6 months

  const productionMetrics = [
    {
      title: 'Total Demos',
      value: totalDemos,
      icon: Factory,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Ready for prospects'
    },
    {
      title: 'Live & Prospecting',
      value: liveProspectingDemos,
      icon: Target,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'Actively generating leads'
    },
    {
      title: 'Claimed Demos',
      value: claimedDemos,
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Converting to customers'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Claim to demo ratio'
    }
  ];

  const revenueMetrics = [
    {
      title: 'Estimated Revenue',
      value: `$${estimatedRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'From claimed demos'
    },
    {
      title: 'Demos This Week',
      value: demosThisWeek,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Production velocity'
    }
  ];

  // Industry breakdown (mock data - you'd calculate this from actual demo data)
  const industryBreakdown = [
    { industry: 'Hair Salons', count: Math.floor(totalDemos * 0.3), claims: Math.floor(claimedDemos * 0.35) },
    { industry: 'Beauty & Makeup', count: Math.floor(totalDemos * 0.25), claims: Math.floor(claimedDemos * 0.3) },
    { industry: 'Photography', count: Math.floor(totalDemos * 0.2), claims: Math.floor(claimedDemos * 0.2) },
    { industry: 'Fitness & Wellness', count: Math.floor(totalDemos * 0.15), claims: Math.floor(claimedDemos * 0.1) },
    { industry: 'Other Services', count: Math.floor(totalDemos * 0.1), claims: Math.floor(claimedDemos * 0.05) }
  ];

  return (
    <div className="space-y-6">
      {/* Demo Factory Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Factory className="w-8 h-8 text-blue-600" />
            Demo Factory
          </h1>
          <p className="text-gray-600 mt-1">
            Internal production system for creating high-converting Template8 demos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={onViewAnalytics} variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button onClick={onManageTemplates} variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Templates
          </Button>
          <Button onClick={onCreateDemo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create Demo
          </Button>
        </div>
      </div>

      {/* Production Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {productionMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bg}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Revenue Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revenueMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bg}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industry Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Industry Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {industryBreakdown.map((industry) => {
              const claimRate = industry.count > 0 ? ((industry.claims / industry.count) * 100).toFixed(1) : '0';
              return (
                <div key={industry.industry} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{industry.industry}</h4>
                      <p className="text-sm text-gray-600">
                        {industry.count} demos • {industry.claims} claimed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={parseFloat(claimRate) > 20 ? 'default' : 'secondary'}>
                      {claimRate}% conversion
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Production Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={onCreateDemo}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-6 h-6" />
              <span>New Demo</span>
            </Button>
            
            <Button 
              onClick={onManageTemplates}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Settings className="w-6 h-6" />
              <span>Template Library</span>
            </Button>
            
            <Button 
              onClick={onViewAnalytics}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span>Performance Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Production Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Factory className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Demo Factory Tips</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Focus on high-converting industries (Hair & Beauty currently leading)</li>
                <li>• Create 3-5 style variations per industry for better prospect matching</li>
                <li>• Use Template8 luxury themes for premium service businesses</li>
                <li>• Monitor claim rates to identify winning demo formulas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
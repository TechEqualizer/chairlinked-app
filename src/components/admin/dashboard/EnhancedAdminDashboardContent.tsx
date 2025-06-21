import React from 'react';
import { ModernAdminStatsCards } from '@/components/admin/ModernAdminStatsCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardSystemOverview } from './DashboardSystemOverview';
import { DemoSitesTableContainer } from '@/components/admin/demo-table/DemoSitesTableContainer';
import { Factory, Plus, BarChart3, Target, Users, TrendingUp, Clock, CheckCircle, Zap } from 'lucide-react';

interface EnhancedAdminDashboardContentProps {
  demoSites: any[];
  isLoading: boolean;
  onCreateDemo: () => void;
  onEditDemo: (siteId: string) => void;
  onDeleteDemo: (siteId: string) => void;
  onDuplicateDemo: (siteId: string) => void;
  onTemplateCreated: () => void;
}

export const EnhancedAdminDashboardContent: React.FC<EnhancedAdminDashboardContentProps> = ({
  demoSites,
  isLoading,
  onCreateDemo,
  onEditDemo,
  onDeleteDemo,
  onDuplicateDemo,
  onTemplateCreated,
}) => {
  const navigate = useNavigate();

  // Calculate demo factory metrics
  const totalDemos = demoSites.length;
  const claimedDemos = demoSites.filter(site => site.lifecycle_stage === 'claimed').length;
  const activeDemos = demoSites.filter(site => site.lifecycle_stage === 'ready_to_share' || site.lifecycle_stage === 'shared').length;
  const conversionRate = totalDemos > 0 ? Math.round((claimedDemos / totalDemos) * 100) : 0;
  const recentDemos = demoSites.filter(site => {
    const createdAt = new Date(site.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdAt >= sevenDaysAgo;
  }).length;

  return (
    <div className="max-w-7xl mx-auto pb-4 lg:pb-8 space-y-6 lg:space-y-8">
      {/* Demo Factory Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Demo Factory</h1>
                <p className="text-blue-100">Production Dashboard & Control Center</p>
              </div>
            </div>
            <p className="text-blue-100 max-w-xl">
              Your centralized hub for creating, managing, and optimizing high-converting demo websites. 
              Monitor production metrics and drive business growth through strategic demo deployment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onCreateDemo}
              className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Demo
            </Button>
            <Button 
              onClick={() => navigate('/admin/demo-factory')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl"
            >
              <Factory className="w-5 h-5 mr-2" />
              Full Demo Factory
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Factory Production Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Production</p>
                <p className="text-2xl font-bold text-gray-900">{totalDemos}</p>
                <p className="text-xs text-green-600 mt-1">+{recentDemos} this week</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Factory className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Demos</p>
                <p className="text-2xl font-bold text-gray-900">{activeDemos}</p>
                <p className="text-xs text-blue-600 mt-1">Ready for prospects</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
                <p className="text-xs text-purple-600 mt-1">{claimedDemos} claimed demos</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                <p className="text-2xl font-bold text-gray-900">${(claimedDemos * 297).toLocaleString()}</p>
                <p className="text-xs text-orange-600 mt-1">Est. from claims</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Factory Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Demo Factory Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={onCreateDemo}
                  className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex flex-col items-center justify-center gap-2"
                >
                  <Plus className="w-6 h-6" />
                  <span className="font-semibold">Create Demo</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/admin/demo-factory')}
                  variant="outline"
                  className="h-20 border-purple-200 hover:bg-purple-50 rounded-xl flex flex-col items-center justify-center gap-2"
                >
                  <Factory className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-purple-600">Demo Factory</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/admin/analytics')}
                  variant="outline"
                  className="h-20 border-green-200 hover:bg-green-50 rounded-xl flex flex-col items-center justify-center gap-2"
                >
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-green-600">Analytics</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/admin/customers')}
                  variant="outline"
                  className="h-20 border-orange-200 hover:bg-orange-50 rounded-xl flex flex-col items-center justify-center gap-2"
                >
                  <Users className="w-6 h-6 text-orange-600" />
                  <span className="font-semibold text-orange-600">Customers</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <DashboardSystemOverview />
        </div>
      </div>

      {/* Production Pipeline - Recent Demo Sites */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Production Pipeline
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/demos')}
              className="rounded-xl px-4 lg:px-6 font-medium shadow-none border-zinc-200 hover:bg-zinc-50 text-sm lg:text-base w-full sm:w-auto"
            >
              View Full Pipeline
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Recent demo sites in production. Monitor status and optimize for conversion.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DemoSitesTableContainer
              demoSites={demoSites.slice(0, 5)}
              onEdit={onEditDemo}
              onDelete={onDeleteDemo}
              onDuplicate={onDuplicateDemo}
              isLoading={isLoading}
              onTemplateCreated={onTemplateCreated}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

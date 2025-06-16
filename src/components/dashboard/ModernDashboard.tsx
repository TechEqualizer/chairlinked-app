import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useClaimedSiteQuery } from '@/hooks/useClaimedSiteQuery';
import { PaymentGateEnhanced } from '@/components/PaymentGateEnhanced';
import { ModernDashboardSidebar } from './ModernDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Globe, MessageSquare, CreditCard, TrendingUp, Users, Star, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const ModernDashboard: React.FC = () => {
  const { profile } = useAuthContext();
  const { data: claimedSite, isLoading, error, refetch } = useClaimedSiteQuery();

  const handleRefresh = () => {
    refetch();
  };

  const stats = [
    { 
      name: 'Active Sites', 
      value: claimedSite ? '1' : '0', 
      icon: Globe, 
      change: claimedSite ? '+100%' : '0%',
      gradient: 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Total Requests', 
      value: '24', 
      icon: MessageSquare, 
      change: '+8%',
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'Monthly Views', 
      value: '1,234', 
      icon: TrendingUp, 
      change: '+23%',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      name: 'Team Members', 
      value: '1', 
      icon: Users, 
      change: '0',
      gradient: 'from-orange-500 to-red-600'
    },
  ];

  const recentActivities = [
    { action: 'Website updated', time: '2 hours ago', status: 'completed' },
    { action: 'New request submitted', time: '4 hours ago', status: 'pending' },
    { action: 'Team member added', time: '1 day ago', status: 'completed' },
    { action: 'Subscription renewed', time: '3 days ago', status: 'completed' },
  ];

  // Simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-200 flex gap-6 p-6">
        <ModernDashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-200 flex gap-6 p-6">
      <ModernDashboardSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl">
          {/* Show error recovery if there's an error */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Connection Issue</h3>
                  <p className="text-xs text-amber-600">Unable to load site data</p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          <PaymentGateEnhanced 
            feature="your full dashboard experience" 
            showIntegratedPrompt={true}
            claimedSite={claimedSite}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-slate-600 text-lg">
                Here's what's happening with your ChairLinked account today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.name} className="beautiful-shadow border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">{stat.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center beautiful-shadow`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 beautiful-shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                            <p className="text-xs text-slate-500">{activity.time}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          activity.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full justify-between bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-12 beautiful-shadow">
                    <span>Create New Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-slate-300 hover:bg-slate-100 rounded-xl h-12">
                    <span>Submit Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-slate-300 hover:bg-slate-100 rounded-xl h-12">
                    <span>View Analytics</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-slate-300 hover:bg-slate-100 rounded-xl h-12">
                    <span>Manage Team</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </PaymentGateEnhanced>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;

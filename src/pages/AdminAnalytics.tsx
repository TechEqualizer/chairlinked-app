
import React from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { TopPerformingSites } from '@/components/admin/TopPerformingSites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <BarChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600 text-lg">Track performance and engagement metrics</p>
          </div>
        </div>

        <AdminStatsCards />

        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TopPerformingSites />
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminAnalytics;

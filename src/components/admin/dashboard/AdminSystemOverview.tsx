
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export const AdminSystemOverview: React.FC = () => {
  return (
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <BarChart className="w-5 h-5 text-white" />
          </div>
          System Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 beautiful-shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">Platform Status</p>
                <p className="text-xs text-slate-500">All systems operational</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800">
              Healthy
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 beautiful-shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">Database Performance</p>
                <p className="text-xs text-slate-500">Response time: 45ms</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
              Optimal
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 beautiful-shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">Pending Requests</p>
                <p className="text-xs text-slate-500">3 customer requests</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-800">
              Review
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from "react";
import { BarChart } from "lucide-react";

export const DashboardSystemOverview: React.FC = () => (
  <div className="rounded-2xl bg-white/80 shadow-none border border-zinc-100 overflow-hidden">
    <div className="flex items-center gap-2 px-6 pt-6">
      <div className="bg-blue-100 rounded-xl w-8 h-8 flex justify-center items-center">
        <BarChart className="text-blue-700 w-5 h-5" />
      </div>
      <span className="font-semibold text-lg text-gray-900">System Overview</span>
    </div>
    <div className="px-6 py-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl px-2 py-2">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
            <div>
              <p className="text-sm font-medium text-gray-900">Platform Status</p>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800">
            Healthy
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl px-2 py-2">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 block" />
            <div>
              <p className="text-sm font-medium text-gray-900">Database Performance</p>
              <p className="text-xs text-gray-500">Response time: 45ms</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
            Optimal
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl px-2 py-2">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-500 block" />
            <div>
              <p className="text-sm font-medium text-gray-900">Pending Requests</p>
              <p className="text-xs text-gray-500">3 customer requests</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-800">
            Review
          </span>
        </div>
      </div>
    </div>
  </div>
);

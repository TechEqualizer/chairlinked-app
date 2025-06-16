
import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Users, BarChart } from "lucide-react";

interface DashboardQuickActionsProps {
  onCreateDemo: () => void;
  onManageCustomers?: () => void;
  onAnalytics?: () => void;
  onTeam?: () => void;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  onCreateDemo,
  onManageCustomers,
  onAnalytics,
  onTeam
}) => (
  <div className="rounded-2xl bg-white/80 shadow-none border border-zinc-100 p-0 overflow-hidden">
    <div className="flex items-center gap-2 px-4 lg:px-6 pt-4 lg:pt-6">
      <div className="bg-violet-100 rounded-xl w-8 h-8 flex justify-center items-center">
        <Zap className="text-violet-700 w-5 h-5" />
      </div>
      <span className="font-semibold text-base lg:text-lg text-gray-900">Quick Actions</span>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 px-4 lg:px-6 pb-4 lg:pb-6 pt-3 lg:pt-4">
      <Button
        className="w-full justify-between text-sm lg:text-base font-semibold rounded-xl h-10 lg:h-12 bg-gradient-to-r from-violet-600 to-violet-500 shadow-none"
        style={{
          boxShadow: "none"
        }}
        onClick={onCreateDemo}
      >
        <span>Create New Demo Site</span>
        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </Button>
      <Button
        variant="outline"
        className="w-full justify-between text-sm lg:text-base font-semibold rounded-xl h-10 lg:h-12 border-zinc-200 shadow-none"
        onClick={onManageCustomers}
      >
        <span>Manage Customers</span>
        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </Button>
      <Button
        variant="outline"
        className="w-full justify-between text-sm lg:text-base font-semibold rounded-xl h-10 lg:h-12 border-zinc-200 shadow-none"
        onClick={onAnalytics}
      >
        <span>Platform Analytics</span>
        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </Button>
      <Button
        variant="outline"
        className="w-full justify-between text-sm lg:text-base font-semibold rounded-xl h-10 lg:h-12 border-zinc-200 shadow-none"
        onClick={onTeam}
      >
        <span>Team Management</span>
        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </Button>
    </div>
  </div>
);


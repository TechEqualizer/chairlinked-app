
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalCustomers: number;
  activeSubscribers: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface CustomerStatsCardsProps {
  stats: Stats;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount / 100);

const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Total Customers</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalCustomers}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Active Subscribers</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.activeSubscribers}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(stats.monthlyRevenue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.conversionRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CustomerStatsCards;

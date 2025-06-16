
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Users, Eye, TrendingUp } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const AdminStatsCards: React.FC = () => {
  const { siteStats, trafficStats, clickStats, leadStats, isLoading } = useAnalyticsData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Demo Sites",
      value: siteStats?.demoSites || 0,
      icon: BarChart,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Unique Visitors",
      value: trafficStats?.uniqueVisitors || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Views",
      value: siteStats?.totalViews || 0,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Conversion Rate",
      value: `${leadStats?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Eye, Shield, Globe } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useStableLoading } from "@/hooks/useStableLoading";
import { Skeleton } from "@/components/ui/skeleton";

const ModernAdminStatsCardsFC: React.FC = () => {
  const { siteStats, trafficStats, isLoading } = useAnalyticsData();
  
  // Use stable loading to prevent flickering
  const stableLoading = useStableLoading(isLoading, 300, 100);

  // Memoize stats to prevent unnecessary re-renders with fallback values
  const stats = useMemo(() => {
    // Provide stable fallback values
    const demoSites = siteStats?.demoSites ?? 0;
    const uniqueVisitors = trafficStats?.uniqueVisitors ?? 0;
    const totalViews = siteStats?.totalViews ?? 0;
    
    return [
      {
        title: "Total Demo Sites",
        value: demoSites,
        icon: Globe,
        gradient: "from-purple-500 to-indigo-600",
      },
      {
        title: "Active Customers", 
        value: uniqueVisitors,
        icon: Users,
        gradient: "from-blue-500 to-cyan-600",
      },
      {
        title: "Total Views",
        value: totalViews,
        icon: Eye,
        gradient: "from-green-500 to-emerald-600",
      },
      {
        title: "System Health",
        value: "99.9%",
        icon: Shield,
        gradient: "from-orange-500 to-red-600",
      }
    ];
  }, [siteStats?.demoSites, siteStats?.totalViews, trafficStats?.uniqueVisitors]);

  if (stableLoading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 rounded-2xl">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title} className="beautiful-shadow border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-slate-600 mb-1 truncate">{stat.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg lg:text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center beautiful-shadow flex-shrink-0 ml-3`}>
                <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export const ModernAdminStatsCards = React.memo(ModernAdminStatsCardsFC);

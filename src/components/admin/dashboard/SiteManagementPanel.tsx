
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Users, 
  Eye,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  Bell,
  Zap
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Site {
  id: string;
  business_name: string;
  site_slug: string;
  prospect_name: string | null;
  prospect_email: string | null;
  updated_at: string;
  status: string;
  site_type?: string;
  user_id?: string;
  demo_view_count?: number;
  demo_last_viewed?: string;
}

interface SiteManagementPanelProps {
  sites: Site[];
  onSiteClick: (siteId: string) => void;
  onContactProspect: (site: Site) => void;
}

export const SiteManagementPanel: React.FC<SiteManagementPanelProps> = ({
  sites,
  onSiteClick,
  onContactProspect
}) => {
  const [activeSection, setActiveSection] = useState<string>('activity');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['activity', 'handoffs']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Filter sites for different categories
  const recentActivity = sites
    .filter(site => {
      const lastViewed = site.demo_last_viewed;
      return lastViewed && new Date(lastViewed) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    })
    .sort((a, b) => new Date(b.demo_last_viewed!).getTime() - new Date(a.demo_last_viewed!).getTime())
    .slice(0, 5);

  const customerHandoffs = sites
    .filter(site => site.site_type === 'live' && site.status === 'published' && !!site.user_id)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const hotProspects = sites
    .filter(site => (site.prospect_name || site.prospect_email) && !site.user_id)
    .filter(site => {
      const views = site.demo_view_count || 0;
      const hasRecentActivity = site.demo_last_viewed && 
        new Date(site.demo_last_viewed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return views > 3 || hasRecentActivity;
    })
    .slice(0, 5);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    count, 
    section, 
    color = 'text-gray-600' 
  }: { 
    title: string; 
    icon: any; 
    count: number; 
    section: string; 
    color?: string; 
  }) => (
    <CollapsibleTrigger 
      className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="text-left">
          <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-500">{count} items</p>
        </div>
      </div>
      {expandedSections.has(section) ? (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}
    </CollapsibleTrigger>
  );

  const SiteItem = ({ site, showAction = false }: { site: Site; showAction?: boolean }) => (
    <div 
      className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      onClick={() => onSiteClick(site.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {site.business_name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {site.prospect_name && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {site.prospect_name}
              </span>
            )}
            {site.demo_view_count && site.demo_view_count > 0 && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {site.demo_view_count}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">
            {formatTimeAgo(site.demo_last_viewed || site.updated_at)}
          </span>
          {showAction && site.prospect_email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onContactProspect(site);
              }}
              className="mt-1 h-6 px-2 text-xs"
            >
              Contact
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden h-fit">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          Site Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Recent Activity Section */}
        <Collapsible open={expandedSections.has('activity')}>
          <SectionHeader
            title="Recent Activity"
            icon={Activity}
            count={recentActivity.length}
            section="activity"
            color="text-green-600"
          />
          <CollapsibleContent className="space-y-1 mt-2">
            {recentActivity.length > 0 ? (
              recentActivity.map(site => (
                <SiteItem key={site.id} site={site} />
              ))
            ) : (
              <p className="text-sm text-gray-500 p-3">No recent activity</p>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Customer Handoffs Section */}
        <Collapsible open={expandedSections.has('handoffs')}>
          <SectionHeader
            title="Customer Handoffs"
            icon={Shield}
            count={customerHandoffs.length}
            section="handoffs"
            color="text-blue-600"
          />
          <CollapsibleContent className="space-y-1 mt-2">
            {customerHandoffs.length > 0 ? (
              customerHandoffs.map(site => (
                <div key={site.id} className="p-3 bg-blue-25 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {site.business_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Customer Live
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(site.updated_at)}
                        </span>
                      </div>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 p-3">No customer handoffs</p>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Hot Prospects Section */}
        <Collapsible open={expandedSections.has('prospects')}>
          <SectionHeader
            title="Hot Prospects"
            icon={Zap}
            count={hotProspects.length}
            section="prospects"
            color="text-red-600"
          />
          <CollapsibleContent className="space-y-1 mt-2">
            {hotProspects.length > 0 ? (
              hotProspects.map(site => (
                <SiteItem key={site.id} site={site} showAction={true} />
              ))
            ) : (
              <p className="text-sm text-gray-500 p-3">No hot prospects</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

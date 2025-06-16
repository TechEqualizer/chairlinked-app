import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Clock, 
  ChevronRight,
  Search,
  Edit,
  Copy,
  Save,
  Settings,
  ExternalLink,
  Users
} from 'lucide-react';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { LifecycleStageBadge } from '@/components/admin/lifecycle/LifecycleStageBadge';
import { LifecycleStageActions } from '@/components/admin/lifecycle/LifecycleStageActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedRecentSitesProps {
  sites: SiteWithLifecycle[];
  onEdit: (siteId: string) => void;
  onViewSite: (site: SiteWithLifecycle) => void;
  onContactProspect?: (site: SiteWithLifecycle) => void;
  onDuplicate?: (siteId: string) => void;
  onSaveAsTemplate?: (siteId: string) => void;
}

export const EnhancedRecentSites: React.FC<EnhancedRecentSitesProps> = ({
  sites,
  onEdit,
  onViewSite,
  onContactProspect,
  onDuplicate,
  onSaveAsTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActions, setExpandedActions] = useState<string | null>(null);

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (site.prospect_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesSearch;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getStageTimestamp = (site: SiteWithLifecycle) => {
    switch (site.lifecycle_stage) {
      case 'shared':
        return site.shared_at ? `Shared ${formatTimeAgo(site.shared_at)}` : null;
      case 'claimed':
        return site.prospect_name ? `Claimed by ${site.prospect_name}` : 'Claimed';
      case 'converting':
        return site.payment_initiated_at ? `Payment started ${formatTimeAgo(site.payment_initiated_at)}` : 'Converting';
      case 'customer_controlled':
        return site.customer_control_granted_at ? `Customer control ${formatTimeAgo(site.customer_control_granted_at)}` : 'Customer controlled';
      case 'live_published':
        return 'Live and published';
      default:
        return `Updated ${formatTimeAgo(site.updated_at)}`;
    }
  };

  const canSaveAsTemplate = (site: SiteWithLifecycle) => {
    return ['shared', 'claimed', 'customer_controlled', 'live_published'].includes(site.lifecycle_stage);
  };

  const canDuplicate = (site: SiteWithLifecycle) => {
    return true; // All sites can be duplicated
  };

  const getSiteUrl = (site: SiteWithLifecycle) => {
    const baseUrl = window.location.origin;
    if (site.site_type === 'demo') {
      return `${baseUrl}/demo/${site.site_slug}`;
    }
    return `${baseUrl}/${site.site_slug}`;
  };

  const isCustomerControlled = (site: SiteWithLifecycle) => {
    return site.lifecycle_stage === 'customer_controlled' || site.lifecycle_stage === 'live_published';
  };

  const handleLifecycleTransitionComplete = () => {
    setExpandedActions(null);
  };

  return (
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Recent Sites
          </CardTitle>
          <Button variant="outline" className="rounded-xl">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search sites or prospects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-0">
          {filteredSites.slice(0, 8).map((site, index) => {
            const isProtected = isCustomerControlled(site);
            const stageTimestamp = getStageTimestamp(site);
            
            return (
              <div 
                key={site.id} 
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === filteredSites.length - 1 ? 'border-b-0' : ''
                } ${isProtected ? 'bg-blue-25 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 text-base">
                          {site.business_name}
                        </h3>
                        <LifecycleStageBadge stage={site.lifecycle_stage} />
                        {isProtected && (
                          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Protected
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {stageTimestamp && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {stageTimestamp}
                          </span>
                        )}
                        
                        {site.demo_view_count && site.demo_view_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {site.demo_view_count} views
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {site.prospect_email && onContactProspect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onContactProspect(site)}
                        className="rounded-lg"
                      >
                        Contact
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getSiteUrl(site), '_blank')}
                      className="rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          <Settings className="w-4 h-4 mr-1" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(site.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Site
                        </DropdownMenuItem>
                        
                        {canDuplicate(site) && onDuplicate && (
                          <DropdownMenuItem onClick={() => onDuplicate(site.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        )}
                        
                        {canSaveAsTemplate(site) && onSaveAsTemplate && (
                          <DropdownMenuItem onClick={() => onSaveAsTemplate(site.id)}>
                            <Save className="w-4 h-4 mr-2" />
                            Save as Template
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 mb-2">Lifecycle Actions</div>
                          <LifecycleStageActions
                            site={site}
                            onTransitionComplete={handleLifecycleTransitionComplete}
                            isAdmin={true}
                          />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sites found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

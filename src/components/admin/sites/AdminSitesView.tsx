
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  RefreshCw,
  Filter,
  Download,
  LayoutGrid,
  List
} from 'lucide-react';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { AdminSiteCard } from './AdminSiteCard';
import { AdminSitesTable } from './AdminSitesTable';

interface AdminSitesViewProps {
  sites: SiteWithLifecycle[];
  onCreateDemo: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  onTemplateCreated?: () => void;
}

export const AdminSitesView: React.FC<AdminSitesViewProps> = ({
  sites,
  onCreateDemo,
  onRefresh,
  isRefreshing,
  onEdit,
  onDelete,
  onPublish,
  onConvertToLive,
  onTemplateCreated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter sites based on search and lifecycle stage
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (site.prospect_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (site.prospect_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    if (stageFilter === 'all') return matchesSearch;
    return matchesSearch && site.lifecycle_stage === stageFilter;
  });

  // Get stage statistics
  const stageStats = sites.reduce((acc, site) => {
    const stage = site.lifecycle_stage || 'draft';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toggleSiteSelection = (siteId: string) => {
    const newSelected = new Set(selectedSites);
    if (newSelected.has(siteId)) {
      newSelected.delete(siteId);
    } else {
      newSelected.add(siteId);
    }
    setSelectedSites(newSelected);
  };

  const toggleSelectAll = () => {
    if (filteredSites.length === 0) return;
    
    const allSelected = filteredSites.every(site => selectedSites.has(site.id));
    const newSelected = new Set<string>();
    
    if (!allSelected) {
      filteredSites.forEach(site => newSelected.add(site.id));
    }
    
    setSelectedSites(newSelected);
  };

  const handleLifecycleTransition = () => {
    // Refresh the data after lifecycle transition
    onRefresh();
  };

  const handleExportData = () => {
    const sitesToExport = selectedSites.size > 0
      ? sites.filter(site => selectedSites.has(site.id))
      : filteredSites;
      
    if (sitesToExport.length === 0) return;

    const csvContent = [
      ['Business Name', 'Lifecycle Stage', 'Prospect Name', 'Prospect Email', 'Created', 'Last Updated', 'URL'].join(','),
      ...sitesToExport.map(site => [
        site.business_name,
        site.lifecycle_stage || 'draft',
        site.prospect_name || '',
        site.prospect_email || '',
        new Date(site.created_at).toLocaleDateString(),
        new Date(site.updated_at).toLocaleDateString(),
        `chairlinked.com/${site.site_type === 'demo' ? 'demo/' : ''}${site.site_slug}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chairlinked-sites-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  const stageDisplayInfo: Record<string, { label: string; emoji: string }> = {
    draft: { label: "Draft", emoji: "📝" },
    ready_to_share: { label: "Ready", emoji: "🚀" },
    shared: { label: "Shared", emoji: "🔗" },
    claimed: { label: "Claimed", emoji: "✋" },
    converting: { label: "Converting", emoji: "💳" },
    customer_controlled: { label: "Customer", emoji: "👤" },
    live_published: { label: "Live", emoji: "🌐" },
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all your sites from one place</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onCreateDemo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Site
            </Button>
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 px-4"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {(Object.keys(stageDisplayInfo) as Array<keyof typeof stageDisplayInfo>).map(stage => (
            <div key={stage} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-gray-900">{stageStats[stage] || 0}</div>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <span>{stageDisplayInfo[stage].emoji}</span>
                {stageDisplayInfo[stage].label}
              </div>
            </div>
          ))}
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sites, prospects, or business names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter */}
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full lg:w-56 h-10 border-gray-200">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="all">All Stages ({sites.length})</SelectItem>
                {(Object.keys(stageDisplayInfo) as Array<keyof typeof stageDisplayInfo>).map(stage => (
                  <SelectItem key={stage} value={stage}>
                    {stageDisplayInfo[stage].emoji} {stageDisplayInfo[stage].label} ({stageStats[stage] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Export */}
            <Button
              variant="outline"
              onClick={handleExportData}
              className="h-10 px-4 border-gray-200"
              disabled={filteredSites.length === 0 && selectedSites.size === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Selected Items Counter */}
          {selectedSites.size > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {selectedSites.size} site{selectedSites.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSites(new Set())}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sites Display - Grid or Table View */}
        {filteredSites.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredSites.map((site) => (
                <AdminSiteCard
                  key={site.id}
                  site={site}
                  isSelected={selectedSites.has(site.id)}
                  onToggleSelection={toggleSiteSelection}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPublish={onPublish}
                  onConvertToLive={onConvertToLive}
                  onTemplateCreated={onTemplateCreated}
                />
              ))}
            </div>
          ) : (
            <AdminSitesTable
              filteredSites={filteredSites}
              selectedSites={selectedSites}
              onToggleSelection={toggleSiteSelection}
              onToggleSelectAll={toggleSelectAll}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublish={onPublish}
              onConvertToLive={onConvertToLive}
              onTemplateCreated={onTemplateCreated}
              onLifecycleTransition={handleLifecycleTransition}
            />
          )
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sites found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || stageFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                : 'Get started by creating your first site.'
              }
            </p>
            {(!searchTerm && stageFilter === 'all') && (
              <Button onClick={onCreateDemo} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Site
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

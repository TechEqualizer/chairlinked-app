import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Star, 
  TrendingUp, 
  Calendar,
  Tag,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { useAdminDemoSites } from '@/hooks/useAdminDemoSites';

export const DemoLibraryManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { demoSites, loading } = useAdminDemoSites();

  // Filter demos based on search and filters
  const filteredDemos = demoSites?.filter(demo => {
    const matchesSearch = demo.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demo.site_slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || 
                           demo.generated_config?.industry?.toLowerCase().includes(selectedIndustry.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || demo.lifecycle_stage === selectedStatus;
    
    return matchesSearch && matchesIndustry && matchesStatus;
  }) || [];

  // Industry categories for filtering
  const industries = [
    'all',
    'Hair Salon',
    'Beauty & Makeup', 
    'Photography',
    'Fitness & Wellness',
    'Coaching',
    'Other'
  ];

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'ready_to_share', label: 'Ready to Share' },
    { value: 'shared', label: 'Live & Prospecting' },
    { value: 'claimed', label: 'Claimed' },
    { value: 'customer_controlled', label: 'Customer Controlled' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      ready_to_share: { label: 'Ready', variant: 'default' as const },
      shared: { label: 'Live', variant: 'default' as const },
      claimed: { label: 'Claimed', variant: 'default' as const },
      customer_controlled: { label: 'Customer', variant: 'default' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getConversionRate = (demo: any) => {
    // Mock conversion rate calculation
    // In real implementation, you'd calculate based on views vs claims
    const rates = ['18%', '22%', '15%', '28%', '12%', '31%', '25%'];
    return rates[Math.floor(Math.random() * rates.length)];
  };

  const handleDuplicateDemo = (demo: any) => {
    console.log('Duplicating demo:', demo.id);
    // Implement demo duplication logic
  };

  const handleEditDemo = (demo: any) => {
    console.log('Editing demo:', demo.id);
    // Navigate to editor with demo data
  };

  const handleDeleteDemo = (demo: any) => {
    console.log('Deleting demo:', demo.id);
    // Implement demo deletion with confirmation
  };

  const handleViewDemo = (demo: any) => {
    const demoUrl = `/demo/${demo.site_slug}`;
    window.open(demoUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Demo Library Manager</h2>
          <p className="text-gray-600 mt-1">
            Organize and manage your Template8 demo portfolio
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Export List
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Star className="w-4 h-4" />
            Featured Demos
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search demos by name or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredDemos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No demos found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedIndustry !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first demo to get started'
                }
              </p>
            </div>
          </div>
        ) : (
          filteredDemos.map((demo) => (
            <Card key={demo.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Demo Preview */}
                <div className="relative mb-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{demo.business_name}</h3>
                      <p className="text-sm opacity-75">
                        {demo.generated_config?.industry || 'Template8 Demo'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => handleViewDemo(demo)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Demo Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {demo.business_name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        /{demo.site_slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {getStatusBadge(demo.lifecycle_stage)}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{getConversionRate(demo)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(demo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Industry Tag */}
                  {demo.generated_config?.industry && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {demo.generated_config.industry}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDemo(demo)}
                        className="h-8 px-2"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditDemo(demo)}
                        className="h-8 px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateDemo(demo)}
                        className="h-8 px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteDemo(demo)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Library Summary</h4>
              <p className="text-sm text-gray-600">
                {filteredDemos.length} demos shown • {demoSites?.length || 0} total demos
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {demoSites?.filter(d => d.lifecycle_stage === 'shared').length || 0}
                </div>
                <div className="text-gray-600">Live</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {demoSites?.filter(d => d.lifecycle_stage === 'claimed').length || 0}
                </div>
                <div className="text-gray-600">Claimed</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {demoSites?.filter(d => d.lifecycle_stage === 'draft').length || 0}
                </div>
                <div className="text-gray-600">Draft</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
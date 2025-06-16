
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { useAdminDemoOperations } from '@/hooks/useAdminDemoOperations';
import { useToast } from '@/hooks/use-toast';

interface DuplicateGroup {
  businessName: string;
  demos: any[];
  duplicateCount: number;
}

interface DemoCleanupSectionProps {
  onRefresh: () => void;
}

const DemoCleanupSection: React.FC<DemoCleanupSectionProps> = ({ onRefresh }) => {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [selectedDuplicates, setSelectedDuplicates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { findDuplicateDemos, cleanupDuplicates, isLoading } = useAdminDemoOperations();
  const { toast } = useToast();

  const loadDuplicates = async () => {
    setLoading(true);
    try {
      const duplicateGroups = await findDuplicateDemos();
      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Error loading duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, []);

  const formatLastEdited = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const toggleDuplicateSelection = (businessName: string) => {
    const newSelected = new Set(selectedDuplicates);
    if (newSelected.has(businessName)) {
      newSelected.delete(businessName);
    } else {
      newSelected.add(businessName);
    }
    setSelectedDuplicates(newSelected);
  };

  const handleCleanupSelected = async () => {
    const selectedGroups = duplicates.filter(group => 
      selectedDuplicates.has(group.businessName)
    );

    if (selectedGroups.length === 0) {
      toast({
        title: "No selection",
        description: "Please select duplicate groups to clean up",
        variant: "destructive",
      });
      return;
    }

    const totalToDelete = selectedGroups.reduce((sum, group) => sum + (group.demos.length - 1), 0);
    
    if (confirm(`This will delete ${totalToDelete} duplicate demo sites, keeping the most recent version of each. Continue?`)) {
      await cleanupDuplicates(selectedGroups);
      setSelectedDuplicates(new Set());
      await loadDuplicates();
      onRefresh();
    }
  };

  const handleCleanupAll = async () => {
    const totalToDelete = duplicates.reduce((sum, group) => sum + (group.demos.length - 1), 0);
    
    if (confirm(`This will delete ${totalToDelete} duplicate demo sites, keeping the most recent version of each. Continue?`)) {
      await cleanupDuplicates(duplicates);
      await loadDuplicates();
      onRefresh();
    }
  };

  const viewSite = (siteSlug: string) => {
    window.open(`${window.location.origin}/site/${siteSlug}`, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demo Site Cleanup</CardTitle>
          <CardDescription>Loading duplicate analysis...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Demo Site Cleanup
            </CardTitle>
            <CardDescription>
              Manage and clean up duplicate or unnecessary demo sites
            </CardDescription>
          </div>
          <Button onClick={loadDuplicates} variant="outline" size="sm">
            Refresh Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {duplicates.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-600 mb-2">
              <Copy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            </div>
            <p className="text-gray-600">No duplicate demo sites found!</p>
            <p className="text-sm text-gray-500">Your demo library is clean.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Found {duplicates.length} business{duplicates.length > 1 ? 'es' : ''} with duplicate demos
                  </p>
                  <p className="text-sm text-yellow-700">
                    Total duplicates: {duplicates.reduce((sum, group) => sum + (group.demos.length - 1), 0)} sites
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCleanupSelected}
                  disabled={selectedDuplicates.size === 0 || isLoading}
                  variant="destructive"
                  size="sm"
                >
                  Clean Selected ({selectedDuplicates.size})
                </Button>
                <Button 
                  onClick={handleCleanupAll}
                  disabled={isLoading}
                  variant="destructive"
                  size="sm"
                >
                  Clean All Duplicates
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {duplicates.map((group) => (
                <div key={group.businessName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedDuplicates.has(group.businessName)}
                        onChange={() => toggleDuplicateSelection(group.businessName)}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300"
                      />
                      <h4 className="font-medium capitalize">{group.businessName}</h4>
                      <Badge variant="destructive">
                        {group.duplicateCount} duplicates
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {group.demos.map((demo, index) => (
                      <div key={demo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-3">
                          {index === 0 ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Keep (Latest)
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Will Delete
                            </Badge>
                          )}
                          <div>
                            <p className="font-medium">{demo.business_name}</p>
                            <p className="text-sm text-gray-600">
                              Last edited: {formatLastEdited(demo.updated_at)}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => viewSite(demo.site_slug)}
                          variant="ghost"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoCleanupSection;

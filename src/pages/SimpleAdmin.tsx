import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit, Settings } from 'lucide-react';

interface Site {
  id: string;
  business_name: string;
  site_slug: string;
  lifecycle_stage: string;
  site_type: string;
}

const SimpleAdmin: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  // Load mock sites
  useEffect(() => {
    const loadSites = () => {
      const mockSites: Site[] = [
        {
          id: 'demo-1',
          business_name: 'Beauty Studio Demo',
          site_slug: 'beauty-studio-demo',
          lifecycle_stage: 'ready_to_share',
          site_type: 'demo'
        },
        {
          id: 'demo-2',
          business_name: 'Hair Salon Demo',
          site_slug: 'hair-salon-demo',
          lifecycle_stage: 'shared',
          site_type: 'demo'
        },
        {
          id: 'demo-3',
          business_name: 'Photography Studio Demo',
          site_slug: 'photography-studio-draft',
          lifecycle_stage: 'draft',
          site_type: 'demo'
        }
      ];

      // Apply localStorage overrides
      const sitesWithOverrides = mockSites.map(site => {
        const overrideKey = `admin_mock_lifecycle_${site.id}`;
        const override = localStorage.getItem(overrideKey);
        if (override) {
          return { ...site, lifecycle_stage: override };
        }
        return site;
      });

      setSites(sitesWithOverrides);
      setLoading(false);
    };

    loadSites();

    // Listen for lifecycle updates
    const handleLifecycleUpdate = (event: any) => {
      const { siteId, newStage } = event.detail;
      setSites(prevSites => 
        prevSites.map(site => 
          site.id === siteId 
            ? { ...site, lifecycle_stage: newStage }
            : site
        )
      );
    };

    window.addEventListener('mock-lifecycle-updated', handleLifecycleUpdate);
    return () => window.removeEventListener('mock-lifecycle-updated', handleLifecycleUpdate);
  }, []);

  const updateLifecycleStage = (siteId: string, newStage: string) => {
    // Update localStorage
    const key = `admin_mock_lifecycle_${siteId}`;
    localStorage.setItem(key, newStage);

    // Update state
    setSites(prevSites => 
      prevSites.map(site => 
        site.id === siteId 
          ? { ...site, lifecycle_stage: newStage }
          : site
      )
    );

    // Dispatch event
    const event = new CustomEvent('mock-lifecycle-updated', { 
      detail: { siteId, newStage } 
    });
    window.dispatchEvent(event);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready_to_share': return 'bg-blue-100 text-blue-800';
      case 'shared': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailableTransitions = (currentStage: string) => {
    const allStages = ['draft', 'ready_to_share', 'shared', 'claimed'];
    return allStages.filter(stage => stage !== currentStage);
  };

  const getSiteUrl = (site: Site) => {
    return `http://localhost:8080/demo/${site.site_slug}`;
  };

  const getEditUrl = (site: Site) => {
    return `${getSiteUrl(site)}?admin=true`;
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Simple Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage demo sites and lifecycle stages
          </p>
        </div>

        <div className="grid gap-6">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{site.business_name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {site.site_slug} • {site.site_type}
                    </p>
                  </div>
                  <Badge className={getStageColor(site.lifecycle_stage)}>
                    {site.lifecycle_stage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* View Site */}
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={getSiteUrl(site)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Site
                    </a>
                  </Button>

                  {/* Edit Site (for draft stages) */}
                  {site.lifecycle_stage === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={getEditUrl(site)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Configuration
                      </a>
                    </Button>
                  )}

                  {/* Lifecycle Transitions */}
                  <div className="flex flex-wrap gap-2">
                    {getAvailableTransitions(site.lifecycle_stage).map((stage) => (
                      <Button
                        key={stage}
                        variant="ghost"
                        size="sm"
                        onClick={() => updateLifecycleStage(site.id, stage)}
                        className="text-xs"
                      >
                        → {stage}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* URL Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <p><strong>Public URL:</strong> <code>{getSiteUrl(site)}</code></p>
                  {site.lifecycle_stage === 'draft' && (
                    <p><strong>Admin Edit URL:</strong> <code>{getEditUrl(site)}</code></p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Test Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Test Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Draft Sites:</strong> Only accessible with ?admin=true parameter</p>
              <p><strong>Shared Sites:</strong> Show claim button interface to public</p>
              <p><strong>Claimed Sites:</strong> Show read-only demo interface</p>
              <p className="mt-4 p-3 bg-blue-50 rounded">
                <strong>Test Flow:</strong> Move "Photography Studio Demo" from draft → shared → claimed 
                and test the URL behavior at each stage.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleAdmin;
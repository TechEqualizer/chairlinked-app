
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';

interface Site {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
}

interface SitePreviewSectionProps {
  site: Site;
}

export const SitePreviewSection: React.FC<SitePreviewSectionProps> = ({ site }) => {
  const siteUrl = `https://chairlinked.com/${site.site_slug}`;

  const handleViewSite = () => {
    window.open(siteUrl, '_blank');
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Website Preview</CardTitle>
        <Button onClick={handleViewSite} variant="outline" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Live Site
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-gray-50 rounded-lg mx-6 mb-6" style={{ height: '400px' }}>
          <iframe
            src={siteUrl}
            className="w-full h-full rounded-lg border border-gray-200"
            title={`${site.business_name} Website Preview`}
            sandbox="allow-scripts allow-same-origin"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
               onClick={handleViewSite}>
            <div className="bg-white rounded-lg p-3 shadow-lg">
              <Eye className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Site {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
  created_at: string;
}

interface MainSiteCardProps {
  site: Site;
}

export const MainSiteCard: React.FC<MainSiteCardProps> = ({ site }) => {
  const { toast } = useToast();
  const siteUrl = `https://chairlinked.com/${site.site_slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    toast({
      title: "URL Copied!",
      description: "Your ChairLinked URL has been copied to clipboard.",
    });
  };

  const handleViewSite = () => {
    window.open(siteUrl, '_blank');
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Your ChairLinked Site</CardTitle>
          <Badge variant={site.status === 'published' ? 'default' : 'secondary'}>
            {site.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          {site.logo_url && (
            <img 
              src={site.logo_url} 
              alt={`${site.business_name} logo`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{site.business_name}</h3>
            <p className="text-gray-600">chairlinked.com/{site.site_slug}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your ChairLinked URL</p>
              <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                {siteUrl}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyUrl}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleViewSite}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-semibold">
              {new Date(site.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold capitalize">{site.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

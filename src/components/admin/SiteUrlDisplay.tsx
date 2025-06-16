
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { generateDisplayUrl, generateShareableUrl } from '@/utils/urlGenerator';
import { useToast } from '@/hooks/use-toast';

interface Site {
  id: string;
  business_name: string;
  site_slug: string;
  site_type?: string;
  status: string;
}

interface SiteUrlDisplayProps {
  site: Site;
}

export const SiteUrlDisplay: React.FC<SiteUrlDisplayProps> = ({ site }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const displayUrl = generateDisplayUrl({
    slug: site.site_slug,
    siteType: (site.site_type as 'demo' | 'live') || 'live',
    status: site.status as 'draft' | 'published'
  });

  const shareableUrl = generateShareableUrl({
    slug: site.site_slug,
    siteType: (site.site_type as 'demo' | 'live') || 'live',
    status: site.status as 'draft' | 'published'
  });

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "URL copied!",
        description: "Demo URL has been copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleOpenUrl = () => {
    window.open(shareableUrl, '_blank');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
          {displayUrl}
        </code>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyUrl}
            className="h-6 w-6 p-0"
            title="Copy URL"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenUrl}
            className="h-6 w-6 p-0"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {site.site_type === 'demo' && (
        <div className="text-xs text-gray-500">
          Share this link with prospects to showcase their potential site
        </div>
      )}
    </div>
  );
};

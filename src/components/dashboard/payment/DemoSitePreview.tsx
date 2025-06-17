import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock } from 'lucide-react';

interface ClaimedSite {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
  created_at: string;
  claimed_at: string;
}

interface DemoSitePreviewProps {
  claimedSite: ClaimedSite;
}

export const DemoSitePreview: React.FC<DemoSitePreviewProps> = ({ claimedSite }) => {
  const getDemoUrl = () => {
    // Use localhost in development, production URL otherwise
    const isLocalDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    
    const baseUrl = isLocalDev 
      ? window.location.origin 
      : 'https://chairlinked.com';
    
    // Always use /demo/ path for demo sites
    return `${baseUrl}/demo/${claimedSite.site_slug}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'text-green-600 bg-green-50';
      case 'published':
        return 'text-blue-600 bg-blue-50';
      case 'draft':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
          {claimedSite.logo_url ? (
            <img 
              src={claimedSite.logo_url} 
              alt={claimedSite.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-lg">
                {claimedSite.business_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Site Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-1">
            {claimedSite.business_name}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claimedSite.status)}`}>
              {claimedSite.status.charAt(0).toUpperCase() + claimedSite.status.slice(1)}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Claimed {new Date(claimedSite.claimed_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Your claimed demo site - view it while choosing your plan
          </p>
        </div>

        {/* View Button */}
        <Button
          onClick={() => {
            const url = getDemoUrl();
            console.log('DemoSitePreview - View Demo clicked:', {
              claimedSiteSlug: claimedSite.site_slug,
              generatedUrl: url,
              hostname: window.location.hostname,
              origin: window.location.origin
            });
            window.open(url, '_blank');
          }}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white hover:bg-slate-50"
        >
          <ExternalLink className="w-4 h-4" />
          View Demo
        </Button>
      </div>
    </div>
  );
};

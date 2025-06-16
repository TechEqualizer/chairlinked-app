
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Monitor } from 'lucide-react';
import { usePreviewControl } from '@/hooks/usePreviewControl';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';

interface EditorPreviewPanelProps {
  data: SimpleEditorData;
  claimedSite: any;
}

export const EditorPreviewPanel: React.FC<EditorPreviewPanelProps> = ({
  data,
  claimedSite,
}) => {
  const { previewMode, setPreviewMode } = usePreviewControl();

  // Transform the simple editor data into the format expected by ChairLinkedRenderer
  const previewData = React.useMemo(() => {
    const transformedData = {
      businessName: data.businessName,
      tagline: data.tagline,
      headline: data.headline || data.tagline,
      subheadline: data.subheadline,
      description: data.description,
      ctaText: data.ctaText,
      colors: { 
        primary: data.primaryColor, 
        secondary: '#E0E7FF' 
      },
      // Map primaryColor to brandColor for Template8Layout compatibility
      brandColor: data.primaryColor,
      contact: {
        phone: data.phone,
        email: data.email,
        address: data.address
      },
      logoUrl: data.logoUrl,
      heroImage: data.heroImageUrl,
      // Also map to heroImageUrl for backward compatibility
      heroImageUrl: data.heroImageUrl,
      services: data.services || [],
      images: [],
      testimonials: data.testimonials || [],
      stories: data.stories || [],
      gallery: data.gallery || [],
      heroImages: data.heroImageUrl ? [data.heroImageUrl] : [],
      isProductionPreview: true
    };
    
    console.log('[EditorPreviewPanel] Transformed preview data:', {
      primaryColor: data.primaryColor,
      brandColor: transformedData.brandColor,
      heroImage: transformedData.heroImage,
      heroImageUrl: transformedData.heroImageUrl
    });
    return transformedData;
  }, [data]);

  const getPreviewUrl = () => {
    if (claimedSite.site_type === 'live' && data.businessName) {
      const cleanSlug = data.businessName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `https://chairlinked.com/${cleanSlug}`;
    }
    return `https://chairlinked.com/${claimedSite.site_slug}`;
  };

  const isLiveSite = claimedSite.site_type === 'live';
  const previewUrl = getPreviewUrl();

  return (
    <div className="flex-1 bg-gray-100 flex flex-col">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={previewMode === 'editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('editor')}
              className="px-3 py-1 text-xs"
            >
              Live Editor
            </Button>
            <Button
              variant={previewMode === 'live' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('live')}
              className="px-3 py-1 text-xs"
              disabled={!isLiveSite}
            >
              Published Version
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant="default"
              size="sm"
              className="p-2"
            >
              <Monitor size={16} />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(previewUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Open Link
          </Button>
        </div>
      </div>

      {/* Live URL Display for Live Sites */}
      {isLiveSite && previewMode === 'live' && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-700 font-medium">Live URL:</span>
            <span className="text-green-800 font-mono">{previewUrl}</span>
            <span className="text-xs text-green-600 ml-2">(This is your permanent, professional URL)</span>
          </div>
        </div>
      )}

      <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full h-full">
          {previewMode === 'editor' ? (
            <div className="w-full h-full overflow-auto">
              <ChairLinkedRenderer 
                config={previewData}
                isProductionPreview={true}
                siteType={claimedSite.site_type}
              />
            </div>
          ) : (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Published Website Preview"
              key={`${previewUrl}-${previewMode}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

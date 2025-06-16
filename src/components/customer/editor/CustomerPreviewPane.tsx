import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePreviewControl } from '@/hooks/usePreviewControl';
import { PreviewHeader } from './preview/PreviewHeader';
import { PreviewContent } from './preview/PreviewContent';

interface CustomerPreviewPaneProps {
  data: any;
  siteSlug: string;
  siteType?: string;
  businessName?: string;
}

export const CustomerPreviewPane: React.FC<CustomerPreviewPaneProps> = ({
  data,
  siteSlug,
  siteType = 'demo',
  businessName,
}) => {
  const { previewDevice, setPreviewDevice, previewMode, setPreviewMode } = usePreviewControl();

  console.log('[CustomerPreviewPane] Rendering with:', {
    hasData: !!data,
    siteSlug,
    siteType,
    businessName,
    previewMode
  });

  const generateCleanSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const getPreviewUrl = () => {
    if (siteType === 'live' && businessName) {
      const cleanSlug = generateCleanSlug(businessName);
      return `https://chairlinked.com/${cleanSlug}`;
    }
    return `https://chairlinked.com/${siteSlug}`;
  };

  const isLiveSite = siteType === 'live';
  const previewUrl = getPreviewUrl();
  const finalBusinessName = businessName || data?.businessName || 'Business Name';

  return (
    <div className="h-full flex flex-col">
      <PreviewHeader
        isLiveSite={isLiveSite}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        previewUrl={previewUrl}
      />
      
      {isLiveSite && previewMode === 'live' && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-700 font-medium">Live URL:</span>
            <span className="text-green-800 font-mono">{previewUrl}</span>
            <span className="text-xs text-green-600 ml-2">(This is your permanent, professional URL)</span>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center overflow-hidden relative">
        <PreviewContent
          data={data}
          businessName={finalBusinessName}
          siteType={siteType}
          previewMode={previewMode}
          previewDevice={previewDevice}
          previewUrl={previewUrl}
        />
        
        {!data && previewMode === 'editor' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

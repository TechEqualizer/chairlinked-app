
import React from 'react';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PreviewDevice, PreviewMode } from '@/hooks/usePreviewControl';

interface PreviewContentProps {
  data: any;
  businessName: string;
  siteType: string;
  previewMode: PreviewMode;
  previewDevice: PreviewDevice;
  previewUrl: string;
}

const PreviewErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('[CustomerPreviewPane] Render error:', error);
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Error</h3>
          <p className="text-gray-600 mb-4">
            There was an issue rendering the preview. Please check your content.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }
};

export const PreviewContent: React.FC<PreviewContentProps> = ({
  data,
  businessName,
  siteType,
  previewMode,
  previewDevice,
  previewUrl,
}) => {
  const getDeviceClasses = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-[700px]';
      case 'tablet':
        return 'w-[768px] h-[700px]';
      default:
        return 'w-full h-full';
    }
  };

  const template8Data = {
    businessName: businessName || data?.businessName || 'Business Name',
    headline: data?.headline || `Welcome to ${businessName || 'Your Business'}`,
    description: data?.description || data?.subheadline || 'Professional services you can trust',
    services: data?.services || [],
    images: data?.images || [],
    heroImages: data?.heroImages || [],
    testimonials: data?.testimonials || [],
    colors: data?.colors || { primary: '#6B46C1', secondary: '#E0E7FF' },
    contact: data?.contact || {},
    location: data?.location || {},
    ...data,
    isProductionPreview: true
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${getDeviceClasses()}`}>
      <PreviewErrorBoundary>
        {previewMode === 'editor' && data ? (
          <div className="w-full h-full overflow-auto">
            <ChairLinkedRenderer 
              config={template8Data}
              isProductionPreview={true}
              siteType={siteType}
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
      </PreviewErrorBoundary>
    </div>
  );
};

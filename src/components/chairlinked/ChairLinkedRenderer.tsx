
import React from "react";
import Template8Layout from "@/components/template8/Template8Layout";

interface ChairLinkedRendererProps {
  config: any;
  logoUrl?: string;
  isProductionPreview?: boolean;
  siteType?: string; // New prop to pass site type information
}

const ChairLinkedRenderer: React.FC<ChairLinkedRendererProps> = ({ 
  config, 
  logoUrl,
  isProductionPreview = false,
  siteType = 'demo' // Default to demo for backward compatibility
}) => {
  console.log('[ChairLinkedRenderer] Rendering with config:', {
    businessName: config?.businessName,
    hasImages: !!config?.images?.length,
    hasServices: !!config?.services?.length,
    isProductionPreview,
    siteType,
    configKeys: config ? Object.keys(config) : [],
    configSize: config ? JSON.stringify(config).length : 0
  });

  if (!config) {
    console.warn('[ChairLinkedRenderer] No config provided');
    // In production preview, show a clean loading state instead of error message
    if (isProductionPreview) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Site Configuration Missing</h2>
          <p className="text-gray-600">This site hasn't been properly configured yet.</p>
        </div>
      </div>
    );
  }

  // Additional safety check for malformed config that could cause blank screens
  if (typeof config !== 'object' || Array.isArray(config)) {
    console.error('[ChairLinkedRenderer] Invalid config format:', typeof config, config);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Site Configuration</h2>
          <p className="text-gray-600">The site configuration is corrupted. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <Template8Layout 
      businessName={config.businessName || "Creative Studio"}
      initialData={config}
      isChairLinkedMode={true}
      isProductionPreview={isProductionPreview}
      siteType={siteType}
    />
  );
};

export default ChairLinkedRenderer;

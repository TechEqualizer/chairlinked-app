
import React from "react";
import { motion } from "framer-motion";
import { X, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroImageManager from "./textPanel/imagesTab/HeroImageManager";
import BackgroundControls from "./textPanel/imagesTab/BackgroundControls";
import OverlaySettings from "./textPanel/imagesTab/OverlaySettings";
import BackgroundPreviewCard from "./textPanel/imagesTab/BackgroundPreviewCard";

interface HeroImagesPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const HeroImagesPanel: React.FC<HeroImagesPanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  const handleHeroImageChange = (imageUrl: string) => {
    console.log('[HeroImagesPanel] Setting hero image explicitly:', imageUrl);
    onUpdate({ 
      heroImage: imageUrl,
      _heroImageExplicitlySet: true 
    });
  };

  const handleRemoveHeroImage = () => {
    console.log('[HeroImagesPanel] Removing hero image explicitly');
    onUpdate({ 
      heroImage: null,
      _heroImageExplicitlySet: true 
    });
  };

  // Get the current hero image considering explicit setting vs legacy fallback
  const getCurrentHeroImage = () => {
    // If user has explicitly set/removed, use that
    if (pageData._heroImageExplicitlySet) {
      return pageData.heroImage;
    }
    
    // If heroImage property exists, use it
    if (pageData.hasOwnProperty('heroImage')) {
      return pageData.heroImage;
    }
    
    // Legacy fallback for backward compatibility
    return (pageData.heroImages && pageData.heroImages[0]) ||
           (pageData.images && pageData.images[0]?.image) ||
           (pageData.images && pageData.images[0]) ||
           null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <Card className="shadow-xl border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="w-5 h-5" />
              Images & Background
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hero Image */}
          <HeroImageManager
            heroImage={getCurrentHeroImage()}
            brandColor={pageData.brandColor || "#8B5CF6"}
            onImageChange={handleHeroImageChange}
            onRemove={handleRemoveHeroImage}
          />

          {/* Background Controls */}
          <BackgroundControls
            pageData={pageData}
            onUpdate={onUpdate}
          />

          {/* Overlay Settings */}
          <OverlaySettings
            pageData={pageData}
            onUpdate={onUpdate}
          />

          {/* Preview */}
          <BackgroundPreviewCard pageData={pageData} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HeroImagesPanel;

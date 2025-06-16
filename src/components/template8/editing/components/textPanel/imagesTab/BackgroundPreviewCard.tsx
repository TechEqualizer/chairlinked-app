
import React from "react";
import { Video } from "lucide-react";

interface BackgroundPreviewCardProps {
  pageData: any;
}

const BackgroundPreviewCard: React.FC<BackgroundPreviewCardProps> = ({
  pageData
}) => {
  const currentOverlayColor = pageData.overlayColor || pageData.brandColor || '#6366f1';

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-500 mb-2">Background Preview:</div>
      <div className="h-20 rounded-lg overflow-hidden relative border border-gray-200">
        {pageData.backgroundType === "image" && pageData.backgroundImage ? (
          <>
            <img 
              src={pageData.backgroundImage} 
              alt="Background preview" 
              className="w-full h-full object-cover"
            />
            {pageData.enableImageOverlay && (
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundColor: currentOverlayColor,
                  opacity: pageData.backgroundOpacity || 0.7
                }}
              />
            )}
          </>
        ) : pageData.backgroundType === "video" && pageData.backgroundVideo ? (
          <>
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            {pageData.enableImageOverlay && (
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundColor: currentOverlayColor,
                  opacity: pageData.backgroundOpacity || 0.7
                }}
              />
            )}
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${currentOverlayColor}22 0%, ${pageData.brandSecondary || currentOverlayColor}14 50%, ${pageData.brandAccent || currentOverlayColor}08 100%)`
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BackgroundPreviewCard;

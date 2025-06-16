
import React from "react";
import { Video } from "lucide-react";

interface BackgroundPreviewProps {
  backgroundType: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  enableImageOverlay?: boolean;
  backgroundOpacity?: number;
  overlayColor: string;
  brandColor: string;
}

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  backgroundType,
  backgroundImage,
  backgroundVideo,
  enableImageOverlay,
  backgroundOpacity = 0.7,
  overlayColor,
  brandColor
}) => {
  const currentOverlayColor = overlayColor || brandColor || '#6366f1';

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-500 mb-2">Live Preview:</div>
      <div className="h-20 rounded-lg overflow-hidden relative border border-gray-200">
        {backgroundType === "image" && backgroundImage ? (
          <>
            <img 
              src={backgroundImage} 
              alt="Background preview" 
              className="w-full h-full object-cover"
            />
            {enableImageOverlay && (
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundColor: currentOverlayColor,
                  opacity: backgroundOpacity
                }}
              ></div>
            )}
          </>
        ) : backgroundType === "video" && backgroundVideo ? (
          <>
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            {enableImageOverlay && (
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundColor: currentOverlayColor,
                  opacity: backgroundOpacity
                }}
              ></div>
            )}
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${currentOverlayColor}22 0%, ${brandColor || currentOverlayColor}14 50%, ${brandColor || currentOverlayColor}08 100%)`
            }}
          ></div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Type: {backgroundType || "gradient"} | 
        {(backgroundType === "image" || backgroundType === "video") && enableImageOverlay 
          ? ` Overlay: ${enableImageOverlay ? 'On' : 'Off'} |`
          : ''
        } Intensity: {Math.round(backgroundOpacity * 100)}%
      </div>
    </div>
  );
};

export default BackgroundPreview;

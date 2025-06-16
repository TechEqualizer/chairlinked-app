
import React from "react";
import { Label } from "@/components/ui/label";

interface OverlaySettingsProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const OverlaySettings: React.FC<OverlaySettingsProps> = ({
  pageData,
  onUpdate
}) => {
  const handleOverlayToggle = (enabled: boolean) => {
    if (enabled && !pageData.overlayColor) {
      onUpdate({ 
        enableImageOverlay: enabled,
        overlayColor: pageData.brandColor || '#6366f1'
      });
    } else {
      onUpdate({ enableImageOverlay: enabled });
    }
  };

  const handleOverlayColorChange = (color: string) => {
    onUpdate({ overlayColor: color });
  };

  const handleOpacityChange = (opacity: number) => {
    onUpdate({ backgroundOpacity: opacity });
  };

  const currentOverlayColor = pageData.overlayColor || pageData.brandColor || '#6366f1';

  if (pageData.backgroundType !== "image" && pageData.backgroundType !== "video") {
    return null;
  }

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">
        {pageData.backgroundType === "video" ? "Video Overlay" : "Image Overlay"}
      </Label>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={pageData.enableImageOverlay || false}
          onChange={(e) => handleOverlayToggle(e.target.checked)}
          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-600">
          Enable overlay for better text readability
        </span>
      </div>
      
      {pageData.enableImageOverlay && (
        <div className="space-y-3">
          {/* Overlay Color */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Overlay Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded border border-gray-200"
                style={{ backgroundColor: currentOverlayColor }}
              />
              <input
                type="color"
                value={currentOverlayColor}
                onChange={(e) => handleOverlayColorChange(e.target.value)}
                className="flex-1 h-8 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Overlay Intensity */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Overlay Intensity: {Math.round((pageData.backgroundOpacity || 0.7) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={pageData.backgroundOpacity || 0.7}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Light</span>
              <span>Strong</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlaySettings;

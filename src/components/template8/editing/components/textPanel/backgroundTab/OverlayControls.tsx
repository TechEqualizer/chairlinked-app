
import React from "react";

interface OverlayControlsProps {
  backgroundType: string;
  enableImageOverlay?: boolean;
  backgroundOpacity?: number;
  overlayColor: string;
  brandColor: string;
  onOverlayToggle: (enabled: boolean) => void;
  onOpacityChange: (opacity: number) => void;
  onColorChange: (color: string) => void;
}

const OverlayControls: React.FC<OverlayControlsProps> = ({
  backgroundType,
  enableImageOverlay,
  backgroundOpacity = 0.7,
  overlayColor,
  brandColor,
  onOverlayToggle,
  onOpacityChange,
  onColorChange
}) => {
  const currentOverlayColor = overlayColor || brandColor || '#6366f1';

  return (
    <div className="space-y-4">
      {/* Image/Video Overlay Toggle */}
      {(backgroundType === "image" || backgroundType === "video") && (
        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 block">
            Enable {backgroundType === "video" ? "Video" : "Image"} Overlay
          </label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableImageOverlay || false}
              onChange={(e) => onOverlayToggle(e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-xs text-gray-600">
              {enableImageOverlay ? "Overlay enabled" : "Overlay disabled"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Overlay helps improve text readability on background {backgroundType === "video" ? "videos" : "images"}
          </p>
        </div>
      )}

      {/* Background Opacity Control */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          {backgroundType === "image" && enableImageOverlay 
            ? `Overlay Intensity: ${Math.round(backgroundOpacity * 100)}%`
            : backgroundType === "video" && enableImageOverlay
            ? `Video Overlay Intensity: ${Math.round(backgroundOpacity * 100)}%`
            : `Background Opacity: ${Math.round(backgroundOpacity * 100)}%`
          }
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={backgroundOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            {backgroundType === "image" && enableImageOverlay ? "Light Overlay" : 
             backgroundType === "video" && enableImageOverlay ? "Light Overlay" : "Transparent"}
          </span>
          <span>
            {backgroundType === "image" && enableImageOverlay ? "Strong Overlay" : 
             backgroundType === "video" && enableImageOverlay ? "Strong Overlay" : "Opaque"}
          </span>
        </div>
      </div>

      {/* Overlay Color */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          {backgroundType === "image" ? "Image Overlay Color" : 
           backgroundType === "video" ? "Video Overlay Color" : "Gradient Base Color"}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={currentOverlayColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={currentOverlayColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
              placeholder={brandColor || '#6366f1'}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {backgroundType === "image" 
            ? "Color overlay applied on top of the background image"
            : backgroundType === "video"
            ? "Color overlay applied on top of the background video"
            : "Primary color used in the gradient background"
          }
        </p>
      </div>
    </div>
  );
};

export default OverlayControls;

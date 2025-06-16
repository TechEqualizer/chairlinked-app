
import React from "react";
import ResetButton from "./backgroundTab/ResetButton";
import BackgroundTypeSelector from "./backgroundTab/BackgroundTypeSelector";
import BackgroundImageUpload from "./backgroundTab/BackgroundImageUpload";
import VideoBackgroundManager from "./backgroundTab/VideoBackgroundManager";
import OverlayControls from "./backgroundTab/OverlayControls";
import BackgroundPreview from "./backgroundTab/BackgroundPreview";

interface BackgroundImageTabProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const BackgroundImageTab: React.FC<BackgroundImageTabProps> = ({ pageData, onUpdate }) => {
  const handleReset = () => {
    console.log('Resetting background to Template 8 default');
    onUpdate({
      backgroundType: "gradient",
      backgroundImage: undefined,
      backgroundVideo: undefined,
      videoUrl: undefined,
      backgroundOpacity: 0.7,
      overlayColor: pageData.brandColor || '#6366f1',
      enableImageOverlay: false
    });
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    console.log('Background image changed to:', imageUrl);
    if (imageUrl) {
      onUpdate({ 
        backgroundImage: imageUrl,
        backgroundType: "image",
        enableImageOverlay: true,
        overlayColor: pageData.overlayColor || pageData.brandColor || '#6366f1'
      });
    } else {
      onUpdate({ 
        backgroundImage: undefined,
        backgroundType: "gradient",
        enableImageOverlay: false
      });
    }
  };

  const handleRemoveBackgroundImage = () => {
    onUpdate({ 
      backgroundImage: undefined,
      backgroundType: "gradient",
      enableImageOverlay: false
    });
  };

  const handleBackgroundTypeChange = (type: string) => {
    console.log('Background type changed to:', type);
    if (type === "image") {
      onUpdate({ 
        backgroundType: type,
        overlayColor: pageData.overlayColor || pageData.brandColor || '#6366f1'
      });
    } else if (type === "video") {
      onUpdate({ 
        backgroundType: type,
        enableImageOverlay: true,
        overlayColor: pageData.overlayColor || pageData.brandColor || '#6366f1'
      });
    } else {
      onUpdate({ backgroundType: type });
    }
  };

  const handleVideoSubmit = (videoUrl: string) => {
    onUpdate({ 
      backgroundVideo: videoUrl,
      videoUrl: videoUrl,
      backgroundType: "video",
      enableImageOverlay: true,
      overlayColor: pageData.overlayColor || pageData.brandColor || '#6366f1'
    });
  };

  const handleRemoveVideo = () => {
    onUpdate({ 
      backgroundVideo: undefined,
      videoUrl: undefined,
      backgroundType: "gradient"
    });
  };

  const handleOpacityChange = (opacity: number) => {
    console.log('Background opacity changed to:', opacity);
    onUpdate({ backgroundOpacity: opacity });
  };

  const handleOverlayColorChange = (color: string) => {
    console.log('Overlay color changed to:', color);
    onUpdate({ overlayColor: color });
  };

  const handleOverlayToggle = (enabled: boolean) => {
    console.log('Image overlay toggled:', enabled);
    if (enabled && !pageData.overlayColor) {
      onUpdate({ 
        enableImageOverlay: enabled,
        overlayColor: pageData.brandColor || '#6366f1'
      });
    } else {
      onUpdate({ enableImageOverlay: enabled });
    }
  };

  return (
    <div className="space-y-4">
      <ResetButton onReset={handleReset} />

      <BackgroundTypeSelector
        backgroundType={pageData.backgroundType || "gradient"}
        onTypeChange={handleBackgroundTypeChange}
      />

      {pageData.backgroundType === "image" && (
        <BackgroundImageUpload
          backgroundImage={pageData.backgroundImage}
          brandColor={pageData.brandColor || "#8B5CF6"}
          onImageChange={handleBackgroundImageChange}
          onRemove={handleRemoveBackgroundImage}
        />
      )}

      {pageData.backgroundType === "video" && (
        <VideoBackgroundManager
          backgroundVideo={pageData.backgroundVideo}
          onVideoSubmit={handleVideoSubmit}
          onRemove={handleRemoveVideo}
        />
      )}

      <OverlayControls
        backgroundType={pageData.backgroundType || "gradient"}
        enableImageOverlay={pageData.enableImageOverlay}
        backgroundOpacity={pageData.backgroundOpacity || 0.7}
        overlayColor={pageData.overlayColor || pageData.brandColor || '#6366f1'}
        brandColor={pageData.brandColor || '#6366f1'}
        onOverlayToggle={handleOverlayToggle}
        onOpacityChange={handleOpacityChange}
        onColorChange={handleOverlayColorChange}
      />

      <BackgroundPreview
        backgroundType={pageData.backgroundType || "gradient"}
        backgroundImage={pageData.backgroundImage}
        backgroundVideo={pageData.backgroundVideo}
        enableImageOverlay={pageData.enableImageOverlay}
        backgroundOpacity={pageData.backgroundOpacity || 0.7}
        overlayColor={pageData.overlayColor || pageData.brandColor || '#6366f1'}
        brandColor={pageData.brandColor || '#6366f1'}
      />
    </div>
  );
};

export default BackgroundImageTab;

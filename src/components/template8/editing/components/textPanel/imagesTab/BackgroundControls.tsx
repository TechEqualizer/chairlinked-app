
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import BackgroundTypeSelector from "../backgroundTab/BackgroundTypeSelector";
import BackgroundImageUpload from "../backgroundTab/BackgroundImageUpload";
import VideoBackgroundManager from "../backgroundTab/VideoBackgroundManager";

interface BackgroundControlsProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  pageData,
  onUpdate
}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleBackgroundTypeChange = (type: string) => {
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

  const handleBackgroundImageChange = (imageUrl: string) => {
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

  const handleVideoUrlSubmit = (url: string) => {
    onUpdate({ 
      backgroundVideo: url,
      videoUrl: url,
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

  return (
    <div className="space-y-4">
      {/* Background Type */}
      <BackgroundTypeSelector
        backgroundType={pageData.backgroundType || "gradient"}
        onTypeChange={handleBackgroundTypeChange}
      />

      {/* Background Image (only show when image type is selected) */}
      {pageData.backgroundType === "image" && (
        <BackgroundImageUpload
          backgroundImage={pageData.backgroundImage}
          brandColor={pageData.brandColor || "#8B5CF6"}
          onImageChange={handleBackgroundImageChange}
          onRemove={handleRemoveBackgroundImage}
        />
      )}

      {/* Video Background (only show when video type is selected) */}
      {pageData.backgroundType === "video" && (
        <VideoBackgroundManager
          backgroundVideo={pageData.backgroundVideo}
          onVideoSubmit={handleVideoUrlSubmit}
          onRemove={handleRemoveVideo}
        />
      )}
    </div>
  );
};

export default BackgroundControls;

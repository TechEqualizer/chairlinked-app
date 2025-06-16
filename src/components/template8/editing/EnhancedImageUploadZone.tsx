
import React from "react";
import MediaUploadZone from "./MediaUploadZone";

interface EnhancedImageUploadZoneProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  aspectRatio?: string;
  brandColor?: string;
  showDimensionHint?: boolean;
  className?: string;
}

const EnhancedImageUploadZone: React.FC<EnhancedImageUploadZoneProps> = ({
  currentImage,
  onImageChange,
  aspectRatio = "16:9",
  brandColor = "#8B5CF6",
  showDimensionHint = true,
  className = ""
}) => {
  const handleMediaChange = (mediaUrl: string, type: 'image' | 'video') => {
    // For backward compatibility, only accept images in this component
    if (type === 'image' || !mediaUrl) {
      onImageChange(mediaUrl);
    }
  };

  return (
    <MediaUploadZone
      currentMedia={currentImage}
      mediaType="image"
      onMediaChange={handleMediaChange}
      aspectRatio={aspectRatio}
      brandColor={brandColor}
      showDimensionHint={showDimensionHint}
      className={className}
      acceptVideo={false}
    />
  );
};

export default EnhancedImageUploadZone;

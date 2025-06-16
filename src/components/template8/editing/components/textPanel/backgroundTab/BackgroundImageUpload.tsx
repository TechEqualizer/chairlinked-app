
import React from "react";
import { Trash2 } from "lucide-react";
import EnhancedImageUploadZone from "../../../EnhancedImageUploadZone";

interface BackgroundImageUploadProps {
  backgroundImage?: string;
  brandColor: string;
  onImageChange: (imageUrl: string) => void;
  onRemove: () => void;
}

const BackgroundImageUpload: React.FC<BackgroundImageUploadProps> = ({
  backgroundImage,
  brandColor,
  onImageChange,
  onRemove
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-600">Background Image</label>
        {backgroundImage && (
          <button
            onClick={onRemove}
            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove background image"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <EnhancedImageUploadZone
        currentImage={backgroundImage}
        onImageChange={onImageChange}
        aspectRatio="16:9"
        brandColor={brandColor}
        showDimensionHint={true}
        className="h-32"
      />
      <p className="text-xs text-gray-500 mt-1">This image will be used as the hero section background</p>
    </div>
  );
};

export default BackgroundImageUpload;

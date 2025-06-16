
import React from "react";
import { Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import EnhancedImageUploadZone from "../../../EnhancedImageUploadZone";

interface HeroImageManagerProps {
  heroImage?: string;
  brandColor: string;
  onImageChange: (imageUrl: string) => void;
  onRemove: () => void;
}

const HeroImageManager: React.FC<HeroImageManagerProps> = ({
  heroImage,
  brandColor,
  onImageChange,
  onRemove
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">Main Hero Image</Label>
        {heroImage && (
          <button
            onClick={onRemove}
            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove hero image"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <EnhancedImageUploadZone
        currentImage={heroImage}
        onImageChange={onImageChange}
        aspectRatio="4:5"
        brandColor={brandColor}
        showDimensionHint={true}
        className="h-32"
      />
      <p className="text-xs text-gray-500 mt-1">Primary image displayed in the hero section</p>
    </div>
  );
};

export default HeroImageManager;

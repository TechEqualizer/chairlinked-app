
import React from "react";
import { Upload } from "lucide-react";
import CollapsibleSection from "../ui/CollapsibleSection";
import EnhancedImageUploadZone from "../../EnhancedImageUploadZone";

interface HeroImagesSectionProps {
  pageData: any;
  onHeroImageChange: (imageUrl: string) => void;
  onProfileImageChange: (imageUrl: string) => void;
}

const HeroImagesSection: React.FC<HeroImagesSectionProps> = ({ 
  pageData, 
  onHeroImageChange, 
  onProfileImageChange 
}) => {
  return (
    <CollapsibleSection
      title="Hero Images"
      icon={<Upload className="w-4 h-4 text-purple-600" />}
    >
      <div className="space-y-4">
        {/* Main Hero Image */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">Main Hero Image</label>
          <EnhancedImageUploadZone
            currentImage={pageData.heroImage}
            onImageChange={onHeroImageChange}
            aspectRatio="4:5"
            brandColor={pageData.brandColor}
            showDimensionHint={true}
          />
          <p className="text-xs text-gray-500 mt-1">This is the main image displayed in the hero section</p>
        </div>

        {/* Profile Image */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">Profile Image</label>
          <EnhancedImageUploadZone
            currentImage={pageData.profileImage}
            onImageChange={onProfileImageChange}
            aspectRatio="1:1"
            brandColor={pageData.brandColor}
            showDimensionHint={true}
          />
          <p className="text-xs text-gray-500 mt-1">Small circular profile image shown in the hero card</p>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default HeroImagesSection;


import React from "react";
import { EnhancedBackgroundControlsProps } from "./types/backgroundTypes";
import { DEFAULT_BACKGROUND_IMAGE } from "./data/backgroundPresets";
import BackgroundStyleSelector from "./sections/BackgroundStyleSelector";
import BackgroundImageSection from "./sections/BackgroundImageSection";
import HeroImagesSection from "./sections/HeroImagesSection";
import OverlayEffectsSection from "./sections/OverlayEffectsSection";

const EnhancedBackgroundControls: React.FC<EnhancedBackgroundControlsProps> = ({ pageData, onUpdate }) => {
  const handleBackgroundChange = (type: string, value?: string) => {
    console.log('[BackgroundControls] Switching background type to:', type, 'with value:', value);
    
    if (type === 'image') {
      const imageUrl = value || pageData.backgroundImage || DEFAULT_BACKGROUND_IMAGE;
      console.log('[BackgroundControls] Setting image background with URL:', imageUrl);
      
      onUpdate({ 
        backgroundType: 'image',
        backgroundImage: imageUrl,
        backgroundOpacity: pageData.backgroundOpacity || 0.6
      });
    } else if (type === 'gradient') {
      console.log('[BackgroundControls] Setting gradient background');
      onUpdate({ 
        backgroundType: 'gradient',
        backgroundOpacity: pageData.backgroundOpacity || 0.7
      });
    }
  };

  const handleHeroImageChange = (imageUrl: string) => {
    console.log('[BackgroundControls] Updating hero image:', imageUrl);
    onUpdate({ heroImage: imageUrl });
  };

  const handleProfileImageChange = (imageUrl: string) => {
    console.log('[BackgroundControls] Updating profile image:', imageUrl);
    onUpdate({ profileImage: imageUrl });
  };

  const handleCustomImageUpload = (imageUrl: string) => {
    console.log('[BackgroundControls] Custom image uploaded:', imageUrl);
    handleBackgroundChange('image', imageUrl);
  };

  console.log('[BackgroundControls] Current pageData:', {
    backgroundType: pageData.backgroundType,
    backgroundImage: pageData.backgroundImage,
    backgroundOpacity: pageData.backgroundOpacity
  });

  return (
    <div className="space-y-4">
      <BackgroundStyleSelector 
        pageData={pageData}
        onBackgroundChange={handleBackgroundChange}
      />

      <BackgroundImageSection
        pageData={{ ...pageData, onUpdate }}
        onCustomImageUpload={handleCustomImageUpload}
        onBackgroundChange={handleBackgroundChange}
      />

      <HeroImagesSection
        pageData={pageData}
        onHeroImageChange={handleHeroImageChange}
        onProfileImageChange={handleProfileImageChange}
      />

      <OverlayEffectsSection
        pageData={pageData}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default EnhancedBackgroundControls;

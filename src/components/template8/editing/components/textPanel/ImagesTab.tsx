
import React from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import EnhancedImageUploadZone from "../../EnhancedImageUploadZone";

interface ImagesTabProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ pageData, onUpdate }) => {
  const handleReset = () => {
    console.log('Resetting hero image - removing heroImage property entirely');
    // Create a new object without the heroImage property to allow fallback logic
    const updatedData = { ...pageData };
    delete updatedData.heroImage;
    onUpdate(updatedData);
  };

  const handleRemoveHeroImage = () => {
    console.log('Removing hero image explicitly - setting to null');
    // Explicitly set to null to indicate intentional removal
    onUpdate({ heroImage: null });
  };

  const handleHeroImageChange = (imageUrl: string) => {
    console.log('Hero image changed to:', imageUrl);
    // Explicitly set the new image
    onUpdate({ heroImage: imageUrl });
  };

  const hasExplicitHeroImage = pageData.hasOwnProperty('heroImage');
  const currentHeroImage = hasExplicitHeroImage ? pageData.heroImage : 
    ((pageData.heroImages && pageData.heroImages[0]) ||
     (pageData.images && pageData.images[0]?.image) ||
     (pageData.images && pageData.images[0]));

  return (
    <div className="space-y-4">
      {/* Reset Button */}
      <div className="pb-2 border-b border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors w-full justify-center"
        >
          <RotateCcw size={12} />
          Reset to Default
        </button>
      </div>

      {/* Hero Image */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Main Hero Image</label>
          {currentHeroImage && (
            <button
              onClick={handleRemoveHeroImage}
              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove hero image"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <EnhancedImageUploadZone
          currentImage={currentHeroImage}
          onImageChange={handleHeroImageChange}
          aspectRatio="4:5"
          brandColor={pageData.brandColor || "#8B5CF6"}
          showDimensionHint={true}
          className="h-48"
        />
        <p className="text-xs text-gray-500 mt-1">This is the main image displayed in the hero section</p>
        
        {/* Status indicator */}
        <div className="text-xs text-gray-400 mt-1">
          Status: {hasExplicitHeroImage 
            ? (pageData.heroImage ? 'Custom image set' : 'Explicitly removed') 
            : 'Using default/legacy'}
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 mb-2">Current Hero Image:</div>
        {currentHeroImage ? (
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-200">
            <img 
              src={currentHeroImage} 
              alt="Hero preview" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/5] rounded-lg bg-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-500">No hero image set</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesTab;

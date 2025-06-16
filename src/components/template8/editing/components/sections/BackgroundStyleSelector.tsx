
import React from "react";
import { Image, Palette } from "lucide-react";
import CollapsibleSection from "../ui/CollapsibleSection";
import { DEFAULT_BACKGROUND_IMAGE } from "../data/backgroundPresets";

interface BackgroundStyleSelectorProps {
  pageData: any;
  onBackgroundChange: (type: string) => void;
}

const BackgroundStyleSelector: React.FC<BackgroundStyleSelectorProps> = ({ 
  pageData, 
  onBackgroundChange 
}) => {
  return (
    <CollapsibleSection
      title="Background Style"
      icon={<Palette className="w-4 h-4 text-indigo-600" />}
    >
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onBackgroundChange('gradient')}
          className={`p-4 border-2 rounded-lg transition-all ${
            pageData.backgroundType === 'gradient' 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div 
            className="w-full h-16 rounded-md mb-2"
            style={{
              background: `linear-gradient(135deg, ${pageData.brandColor || '#6366f1'}22 0%, ${pageData.brandSecondary || pageData.brandColor || '#6366f1'}18 50%, ${pageData.brandAccent || pageData.brandColor || '#6366f1'}14 100%)`
            }}
          />
          <span className="text-sm font-medium">Gradient</span>
        </button>
        
        <button
          onClick={() => onBackgroundChange('image')}
          className={`p-4 border-2 rounded-lg transition-all ${
            pageData.backgroundType === 'image' 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-full h-16 bg-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            {(pageData.backgroundType === 'image' && (pageData.backgroundImage || DEFAULT_BACKGROUND_IMAGE)) ? (
              <img 
                src={pageData.backgroundImage || DEFAULT_BACKGROUND_IMAGE} 
                alt="Background preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Image className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <span className="text-sm font-medium">Image</span>
        </button>
      </div>
    </CollapsibleSection>
  );
};

export default BackgroundStyleSelector;

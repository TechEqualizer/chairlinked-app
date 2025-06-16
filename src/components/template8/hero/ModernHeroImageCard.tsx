
import React from "react";
import { motion } from "framer-motion";
import EditableImage from "@/components/chairlinked/editing/EditableImage";
import { Camera, Plus } from "lucide-react";

interface ModernHeroImageCardProps {
  heroImage: string | null;
  businessName: string;
  tagline: string;
  brandColor: string;
  onUpdate: (updates: any) => void;
  layoutVariant?: 'floating' | 'split' | 'showcase';
  isPreviewMode?: boolean;
}

const ModernHeroImageCard: React.FC<ModernHeroImageCardProps> = ({
  heroImage,
  businessName,
  tagline,
  brandColor,
  onUpdate,
  layoutVariant = 'floating',
  isPreviewMode = false
}) => {
  const isEditMode = !isPreviewMode; // Template 8 edit mode is inverse of preview mode

  console.log('[ModernHeroImageCard] Edit mode state:', {
    isEditMode,
    isPreviewMode,
    heroImage,
    businessName,
    layoutVariant
  });

  const handleHeroImageChange = (imageUrl: string) => {
    if (isPreviewMode) return;
    console.log('[ModernHeroImageCard] Hero image changing to:', imageUrl);
    onUpdate({ heroImage: imageUrl });
  };

  const getLayoutClasses = () => {
    switch (layoutVariant) {
      case 'split':
        return "w-full max-w-2xl aspect-[3/4]";
      case 'showcase':
        return "w-full max-w-3xl aspect-[4/3]";
      default:
        return "w-full max-w-lg aspect-[4/5]";
    }
  };

  // If no hero image, don't render the image card
  if (!heroImage) {
    // In edit mode, show an "Add Image" placeholder
    if (isEditMode) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`relative ${getLayoutClasses()} mx-auto group cursor-pointer`}
          onClick={() => {
            // Trigger the image upload by simulating a click on the hidden file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result as string;
                  handleHeroImageChange(result);
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}
        >
          <div className="relative w-full h-full rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
            <Plus size={48} className="text-gray-400 mb-4" />
            <div className="text-center px-4">
              <p className="text-lg font-medium text-gray-600 mb-2">Add Hero Image</p>
              <p className="text-sm text-gray-500">Click to upload an image for your hero section</p>
            </div>
          </div>
        </motion.div>
      );
    }
    
    // In preview mode with no image, don't render anything
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Main Image Container */}
      <div className={`relative ${getLayoutClasses()} mx-auto group`}>
        {/* Background Glow Effect */}
        <div 
          className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl transition-all duration-700 group-hover:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${brandColor}40 0%, ${brandColor}20 50%, ${brandColor}10 100%)`
          }} 
        />
        
        {/* Image Card */}
        <div 
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl"
          style={{
            borderColor: `${brandColor}30`,
            boxShadow: `0 25px 60px -12px ${brandColor}20, 0 8px 25px -8px ${brandColor}30`
          }}
        >
          {isEditMode ? (
            <div className="relative w-full h-full">
              <EditableImage 
                src={heroImage} 
                onChange={handleHeroImageChange}
                alt={businessName} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
                aspectClass="w-full h-full" 
              />
              {/* Edit hint overlay */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/20 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-800 flex items-center gap-2">
                  <Camera size={16} />
                  Click to edit image
                </div>
              </div>
            </div>
          ) : (
            <img 
              src={heroImage} 
              alt={businessName} 
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Bottom Content Card */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Content will be added here in future updates */}
          </div>
        </div>

        {/* Floating Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          Open Today
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModernHeroImageCard;

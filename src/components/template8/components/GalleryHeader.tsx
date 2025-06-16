
import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import SimpleEditableText from './SimpleEditableText';

interface GalleryHeaderProps {
  businessName: string;
  categories: string[];
  activeCategory: string;
  brandColor?: string;
  instagramHandle?: string;
  tagline?: string;
  onCategoryChange: (category: string) => void;
  onUpdate?: (updates: any) => void;
  isEditMode?: boolean;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  businessName,
  categories,
  activeCategory,
  brandColor = "#8B5CF6",
  instagramHandle,
  tagline = "Follow our creative journey",
  onCategoryChange,
  onUpdate,
  isEditMode = false
}) => {
  const handleInstagramHandleChange = (newHandle: string) => {
    if (onUpdate) {
      onUpdate({ instagramHandle: newHandle });
    }
  };

  const handleTaglineChange = (newTagline: string) => {
    if (onUpdate) {
      onUpdate({ galleryTagline: newTagline });
    }
  };

  // Generate default Instagram handle if not provided
  const displayHandle = instagramHandle || `@${businessName.toLowerCase().replace(/\s/g, "_")}`;

  return (
    <>
      {/* Modern Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        {isEditMode ? (
          <SimpleEditableText
            value={displayHandle}
            onChange={handleInstagramHandleChange}
            tag="h1"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            placeholder="@your_instagram_handle"
          />
        ) : (
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            {displayHandle}
          </motion.h1>
        )}
        
        {isEditMode ? (
          <SimpleEditableText
            value={tagline}
            onChange={handleTaglineChange}
            tag="p"
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            placeholder="Your gallery tagline..."
          />
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {tagline}
          </motion.p>
        )}
      </motion.div>

      {/* Enhanced Filter System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 
              border-2 backdrop-blur-sm overflow-hidden group
              ${activeCategory === category
                ? "text-white shadow-lg shadow-gray-900/25"
                : "text-gray-700 border-gray-200 bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
              }
            `}
            style={{
              backgroundColor: activeCategory === category ? brandColor : undefined,
              borderColor: activeCategory === category ? brandColor : undefined,
            }}
          >
            {/* Animated background for active state */}
            {activeCategory === category && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: brandColor }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* Category icon for "All" */}
            <span className="relative z-10 flex items-center gap-2">
              {category === "All" && <Hash size={16} />}
              {category}
            </span>

            {/* Hover effect for inactive buttons */}
            {activeCategory !== category && (
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: brandColor }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
};

export default GalleryHeader;

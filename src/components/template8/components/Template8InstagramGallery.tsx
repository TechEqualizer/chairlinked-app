
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryState } from './hooks/useGalleryState';
import { Template8GalleryImage } from '../hooks/useTemplate8Data';
import GalleryHeader from './GalleryHeader';
import GalleryGrid from './GalleryGrid';

interface Template8InstagramGalleryProps {
  images: Template8GalleryImage[];
  businessName: string;
  brandColor?: string;
  onUpdate?: (updates: any) => void;
  onSelectItem?: (index: number) => void;
  pageData?: any;
  isEditMode?: boolean;
}

const Template8InstagramGallery: React.FC<Template8InstagramGalleryProps> = ({
  images,
  businessName,
  brandColor = "#8B5CF6",
  onUpdate,
  onSelectItem,
  pageData,
  isEditMode = false
}) => {
  const {
    activeCategory,
    setActiveCategory,
    likedItems,
    dislikedItems,
    expandedItems,
    mutedVideos,
    bookingClicks,
    onToggleLike,
    onToggleDislike,
    onToggleExpanded,
    onVideoRef,
    onToggleMute,
    onSetMutedVideos,
    onBookingClick
  } = useGalleryState();

  // Enhanced category extraction with better filtering
  const categories = useMemo(() => {
    const uniqueCategories = ["All", ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];
    return uniqueCategories;
  }, [images]);

  // Improved filtering with better performance
  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return images;
    return images.filter(img => img.category === activeCategory);
  }, [images, activeCategory]);

  const handleItemClick = (index: number) => {
    if (onSelectItem && isEditMode) {
      onSelectItem(index);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="text-6xl mb-6">📸</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Gallery Coming Soon</h3>
          <p className="text-gray-600 max-w-md">
            We're preparing an amazing showcase of our work. Check back soon to see our latest projects!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-32 -right-32 w-96 h-96 border border-gray-200/30 rounded-full"
          style={{ borderColor: `${brandColor}20` }}
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${brandColor}15, ${brandColor}25, transparent)`
          }}
        />
        <motion.div
          animate={{ 
            rotate: [0, -360],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/4 w-64 h-64 border-2 border-gray-200/20 rounded-full"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <GalleryHeader
          businessName={businessName}
          categories={categories}
          activeCategory={activeCategory}
          brandColor={brandColor}
          instagramHandle={pageData?.instagramHandle}
          tagline={pageData?.galleryTagline}
          onCategoryChange={setActiveCategory}
          onUpdate={onUpdate}
          isEditMode={isEditMode}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GalleryGrid
              filteredImages={filteredImages}
              businessName={businessName}
              brandColor={brandColor}
              likedItems={likedItems}
              dislikedItems={dislikedItems}
              expandedItems={expandedItems}
              mutedVideos={mutedVideos}
              bookingClicks={bookingClicks}
              onToggleLike={onToggleLike}
              onToggleDislike={onToggleDislike}
              onToggleExpanded={onToggleExpanded}
              onVideoRef={onVideoRef}
              onToggleMute={onToggleMute}
              onSetMutedVideos={onSetMutedVideos}
              onItemClick={handleItemClick}
              onBookingClick={onBookingClick}
            />
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Loading State */}
        {filteredImages.length === 0 && activeCategory !== "All" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts in "{activeCategory}"</h3>
            <p className="text-gray-500">Try selecting a different category to see more content.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Template8InstagramGallery;

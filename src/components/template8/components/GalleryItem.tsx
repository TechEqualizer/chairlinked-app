
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Edit3 } from 'lucide-react';
import { Template8GalleryImage } from '../hooks/useTemplate8Data';
import GalleryMediaRenderer from './GalleryMediaRenderer';
import GalleryInteractions from './GalleryInteractions';

interface GalleryItemProps {
  image: Template8GalleryImage;
  index: number;
  businessName: string;
  brandColor?: string;
  likedItems: Set<number>;
  dislikedItems: Set<number>;
  expandedItems: Set<number>;
  mutedVideos: Set<number>;
  bookingClicks?: Set<number>;
  onToggleLike: (id: number) => void;
  onToggleDislike: (id: number) => void;
  onToggleExpanded: (id: number) => void;
  onVideoRef: (element: HTMLVideoElement | null, id: number) => void;
  onToggleMute: (id: number) => void;
  onSetMutedVideos: React.Dispatch<React.SetStateAction<Set<number>>>;
  onItemClick: (index: number) => void;
  onBookingClick?: (id: number) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  image,
  index,
  businessName,
  brandColor = "#8B5CF6",
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
  onItemClick,
  onBookingClick
}) => {
  // Add null safety checks
  if (!image) {
    console.warn('[GalleryItem] Received null/undefined image at index:', index);
    return null;
  }

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      console.log('[GalleryItem] Item clicked, index:', index);
      if (onItemClick && typeof onItemClick === 'function') {
        onItemClick(index);
      }
    } catch (error) {
      console.error('[GalleryItem] Error in onItemClick:', error);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer gallery-item group"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleItemClick}
    >
      {/* Enhanced Media Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <GalleryMediaRenderer
            image={image}
            mutedVideos={mutedVideos || new Set()}
            onVideoRef={onVideoRef}
            onToggleMute={onToggleMute}
            onSetMutedVideos={onSetMutedVideos}
          />
        </div>

        {/* Enhanced Category Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4"
        >
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm border border-white/20 shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${brandColor}90, ${brandColor}70)`
            }}
          >
            {image.category || "Portfolio"}
          </div>
        </motion.div>

        {/* Video Play Indicator */}
        {image.mediaType === 'video' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute top-4 right-4"
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 border border-white/20">
              <Play className="w-4 h-4 text-white" fill="white" />
            </div>
          </motion.div>
        )}
        
        {/* Modern Edit Mode Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20"
          >
            <Edit3 size={14} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Click to Edit</span>
          </motion.div>
        </motion.div>

        {/* Enhanced Image Loading Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      </div>

      {/* Enhanced Content Section */}
      <div className="gallery-interactions bg-white">
        <GalleryInteractions
          image={image}
          businessName={businessName || "Creative Studio"}
          brandColor={brandColor}
          likedItems={likedItems || new Set()}
          dislikedItems={dislikedItems || new Set()}
          expandedItems={expandedItems || new Set()}
          bookingClicks={bookingClicks}
          onToggleLike={onToggleLike}
          onToggleDislike={onToggleDislike}
          onToggleExpanded={onToggleExpanded}
          onBookingClick={onBookingClick}
        />
      </div>
    </motion.div>
  );
};

export default GalleryItem;

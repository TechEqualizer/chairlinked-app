
import React from 'react';
import { motion } from 'framer-motion';
import { Template8GalleryImage } from '../hooks/useTemplate8Data';
import GalleryItem from './GalleryItem';

interface GalleryGridProps {
  filteredImages: Template8GalleryImage[];
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

const GalleryGrid: React.FC<GalleryGridProps> = ({
  filteredImages,
  businessName,
  brandColor,
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
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {filteredImages.map((image, index) => (
        <motion.div
          key={`${image.id}-${index}`}
          variants={{
            hidden: { 
              opacity: 0, 
              y: 30,
              scale: 0.9
            },
            visible: { 
              opacity: 1, 
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
              }
            }
          }}
          whileHover={{ 
            y: -8,
            transition: { 
              type: "spring", 
              stiffness: 300,
              damping: 20 
            }
          }}
          className="group"
        >
          <GalleryItem
            image={image}
            index={index}
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
            onItemClick={onItemClick}
            onBookingClick={onBookingClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GalleryGrid;

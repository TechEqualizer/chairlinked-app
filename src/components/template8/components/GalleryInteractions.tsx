import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import { Template8GalleryImage } from '../hooks/useTemplate8Data';
import { useToast } from '@/hooks/use-toast';

interface GalleryInteractionsProps {
  image: Template8GalleryImage;
  businessName: string;
  brandColor?: string;
  likedItems: Set<number>;
  dislikedItems: Set<number>;
  expandedItems: Set<number>;
  bookingClicks?: Set<number>;
  onToggleLike: (id: number) => void;
  onToggleDislike: (id: number) => void;
  onToggleExpanded: (id: number) => void;
  onBookingClick?: (id: number) => void;
}

const GalleryInteractions: React.FC<GalleryInteractionsProps> = ({
  image,
  businessName,
  brandColor = "#8B5CF6",
  likedItems,
  dislikedItems,
  expandedItems,
  bookingClicks = new Set(),
  onToggleLike,
  onToggleDislike,
  onToggleExpanded,
  onBookingClick
}) => {
  const { toast } = useToast();
  const [isBookingAnimating, setIsBookingAnimating] = useState(false);

  // Safely get caption with fallback
  const caption = image.caption || '';
  
  // Enhanced hashtag processing
  const processCaption = (text: string): React.ReactNode => {
    const words = text.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index}>
            {index > 0 && ' '}
            <span 
              className="font-medium transition-colors duration-200 hover:opacity-80 cursor-pointer"
              style={{ color: brandColor }}
            >
              {word}
            </span>
          </span>
        );
      }
      return (
        <span key={index}>
          {index > 0 && ' '}
          {word}
        </span>
      );
    });
  };

  // Calculate booking count for this image
  const bookingCount = image.bookings || Math.floor(image.likes * 0.15);
  const currentBookingCount = bookingCount + (bookingClicks.has(image.id) ? 1 : 0);
  const hasBooked = bookingClicks.has(image.id);

  // Enhanced booking click handler with instant feedback
  const handleBookingClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent multiple clicks if already booked
    if (hasBooked) {
      return;
    }
    
    try {
      // Trigger booking animation immediately
      setIsBookingAnimating(true);

      // Show immediate visual feedback with toast
      toast({
        title: "Booking Request",
        description: `Redirecting to book this service...`,
        duration: 2000,
      });

      // Call the booking handler (this now updates state immediately)
      if (onBookingClick) {
        onBookingClick(image.id);
      }

      // Reset animation state
      setTimeout(() => setIsBookingAnimating(false), 600);

    } catch (error) {
      console.error('[Gallery] Error handling booking click:', error);
      toast({
        title: "Booking Error",
        description: "Unable to process booking request. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      setIsBookingAnimating(false);
    }
  };

  return (
    <div className="p-5">
      {/* Enhanced User Info and Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-gray-100 shadow-sm"
              style={{ backgroundColor: brandColor }}
            >
              <span className="text-white text-sm font-bold">
                {businessName.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </motion.div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">{image.user}</span>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(image.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200 group"
          >
            <motion.div
              animate={likedItems.has(image.id) ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                size={20} 
                className={`transition-colors duration-200 ${
                  likedItems.has(image.id) 
                    ? "fill-red-500 text-red-500" 
                    : "group-hover:text-red-500"
                }`}
              />
            </motion.div>
            <span className="text-sm font-medium">
              {image.likes + (likedItems.has(image.id) ? 1 : 0)}
            </span>
          </motion.button>

          <motion.button
            onClick={handleBookingClick}
            whileHover={{ scale: hasBooked ? 1 : 1.1 }}
            whileTap={{ scale: hasBooked ? 1 : 0.9 }}
            disabled={hasBooked}
            className={`flex items-center space-x-2 transition-all duration-200 group relative ${
              hasBooked 
                ? 'text-blue-600 cursor-default' 
                : 'text-gray-500 hover:text-blue-500 cursor-pointer'
            }`}
            title={hasBooked ? "Already booked this service" : "Book this service"}
          >
            <motion.div
              animate={
                isBookingAnimating 
                  ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } 
                  : hasBooked 
                    ? { scale: [1, 1.1, 1] }
                    : {}
              }
              transition={{ duration: 0.4 }}
            >
              <Calendar 
                size={18} 
                className={`transition-colors duration-200 ${
                  hasBooked 
                    ? 'text-blue-500'
                    : 'group-hover:text-blue-500'
                }`}
              />
            </motion.div>
            <span className="text-sm font-medium">
              {currentBookingCount}
            </span>
            
            {/* Booked indicator */}
            {hasBooked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Enhanced Caption */}
      {caption && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-800 leading-relaxed"
        >
          <span className="font-semibold text-gray-900 mr-2">{image.user}</span>
          <span>
            {expandedItems.has(image.id)
              ? processCaption(caption)
              : caption.length > 80
              ? <>
                  {processCaption(caption.substring(0, 80))}...
                </>
              : processCaption(caption)}
          </span>
          {caption.length > 80 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(image.id);
              }}
              whileHover={{ scale: 1.05 }}
              className="text-gray-500 hover:text-gray-800 ml-2 font-medium transition-colors duration-200"
            >
              {expandedItems.has(image.id) ? "less" : "more"}
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Enhanced Engagement Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 pt-3 border-t border-gray-100"
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{image.likes + (likedItems.has(image.id) ? 1 : 0)} likes</span>
          <motion.span
            animate={hasBooked ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={hasBooked ? 'text-blue-600 font-medium' : ''}
          >
            {currentBookingCount} booking{currentBookingCount !== 1 ? 's' : ''}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default GalleryInteractions;

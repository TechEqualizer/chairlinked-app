import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Video } from "lucide-react";
import { InstagramStory } from "../types/storyTypes";
import { detectVideoPlatform, isDirectVideoUrl } from "../utils/videoPlatforms";
import { useEditMode } from "@/components/chairlinked/editing/EditModeContext";
import EditableText from "@/components/chairlinked/editing/EditableText";

interface Template8StoryCardProps {
  story: InstagramStory;
  index: number;
  isActive: boolean;
  isViewed: boolean;
  onClick: (id: number, index: number) => void;
  brandColor: string;
  fontClass: string;
  shape?: 'circle' | 'square' | 'star';
  onStoryUpdate?: (storyId: number, updates: Partial<InstagramStory>) => void;
  theme?: string; // Add theme prop
}

const Template8StoryCard: React.FC<Template8StoryCardProps> = ({
  story,
  index,
  isActive,
  isViewed,
  onClick,
  brandColor,
  fontClass,
  shape = 'circle',
  onStoryUpdate,
  theme = 'light', // Default to light theme
}) => {
  const { isEditMode } = useEditMode();

  console.log(`[Template8StoryCard] Rendering story ${index}:`, {
    id: story.id,
    title: story.title,
    hasImage: !!story.image,
    coverType: story.coverType,
    isActive,
    isViewed,
    shape,
    theme,
    hasOnClick: typeof onClick === 'function'
  });

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger story click when in edit mode and clicking on editable text
    if (isEditMode && (e.target as HTMLElement).closest('[contenteditable]')) {
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    console.log(`[Template8StoryCard] Story clicked:`, {
      storyId: story.id,
      index,
      title: story.title,
      timestamp: new Date().toISOString()
    });
    
    try {
      onClick(story.id, index);
      console.log(`[Template8StoryCard] onClick executed successfully for story ${story.id}`);
    } catch (error) {
      console.error(`[Template8StoryCard] Error in onClick handler:`, error);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    onStoryUpdate?.(story.id, { title: newTitle });
  };

  const handleCTAChange = (newCTA: string) => {
    onStoryUpdate?.(story.id, { ctaText: newCTA });
  };

  // Check if the cover is a video or if the first story item is a video
  const firstItem = story.items?.[0];
  const isCoverVideo = story.coverType === 'video';
  const isFirstItemVideo = firstItem?.type === 'video';
  
  // Enhanced video detection with debugging
  const coverHasValidVideo = isCoverVideo && (detectVideoPlatform(story.image) || isDirectVideoUrl(story.image));
  const firstItemHasValidVideo = isFirstItemVideo && (detectVideoPlatform(firstItem.media) || isDirectVideoUrl(firstItem.media));
  const hasValidVideo = coverHasValidVideo || firstItemHasValidVideo;

  console.log(`[Template8StoryCard] Video detection for story ${story.id}:`, {
    isCoverVideo,
    isFirstItemVideo,
    coverHasValidVideo,
    firstItemHasValidVideo,
    hasValidVideo,
    coverUrl: story.image,
    firstItemUrl: firstItem?.media
  });

  // Use cover video if available, otherwise check first item
  const displayMedia = isCoverVideo ? story.image : (isFirstItemVideo && firstItemHasValidVideo ? firstItem.media : story.image);
  const isDisplayVideo = isCoverVideo || (isFirstItemVideo && firstItemHasValidVideo);

  // Get shape-specific classes
  const getShapeClasses = () => {
    switch (shape) {
      case 'square':
        return {
          container: 'rounded-lg',
          inner: 'rounded-lg',
          image: 'rounded-lg'
        };
      case 'star':
        return {
          container: 'rounded-lg',
          inner: 'rounded-lg',
          image: 'rounded-lg',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        };
      default: // circle
        return {
          container: 'rounded-full',
          inner: 'rounded-full',
          image: 'rounded-full'
        };
    }
  };

  const shapeClasses = getShapeClasses();

  // Determine title color based on theme and state
  const getTitleColor = () => {
    if (theme === 'dark') {
      // In dark mode, use brand color for all titles
      return { color: brandColor };
    } else {
      // Light mode: use brand color only for active unviewed stories
      if (isActive && !isViewed) {
        return { color: brandColor };
      }
      return undefined;
    }
  };

  // Get title classes based on theme and state
  const getTitleClasses = () => {
    if (theme === 'dark') {
      // In dark mode, all titles get consistent styling
      return cn(
        "text-xs sm:text-sm font-semibold leading-tight transition-colors duration-200 block",
        fontClass,
        isActive && "font-bold"
      );
    } else {
      // Light mode keeps original logic
      return cn(
        "text-xs sm:text-sm font-semibold leading-tight transition-colors duration-200 block",
        fontClass,
        isViewed ? "text-gray-500" : "text-gray-800 group-hover:text-gray-900",
        isActive && "font-bold"
      );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer group relative z-10 touch-manipulation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{ 
        pointerEvents: 'auto',
        cursor: 'pointer',
        touchAction: 'manipulation'
      }}
    >
      {/* Mobile-responsive story circle/square/star */}
      <div className="relative mb-2 sm:mb-4 pointer-events-auto">
        {/* Outer glow effect */}
        <div
          className={cn(
            "absolute inset-0 blur-lg opacity-30 transition-all duration-300 pointer-events-none",
            shape === 'star' ? 'rounded-lg' : shapeClasses.container,
            !isViewed && "opacity-50 group-hover:opacity-70"
          )}
          style={{
            background: !isViewed 
              ? `linear-gradient(135deg, ${brandColor}, ${brandColor}80, ${brandColor}40)`
              : "#e5e7eb",
            clipPath: shape === 'star' ? shapeClasses.clipPath : undefined
          }}
        />
        
        {/* Responsive gradient ring */}
        <div
          className={cn(
            "relative p-0.5 sm:p-1 transition-all duration-300 group-hover:shadow-xl cursor-pointer",
            // Mobile sizes
            "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
            shape === 'star' ? 'rounded-lg' : shapeClasses.container,
            !isViewed
              ? "bg-gradient-to-br shadow-lg"
              : "bg-gray-200"
          )}
          style={{
            background: !isViewed
              ? `linear-gradient(135deg, ${brandColor}, ${brandColor}dd, ${brandColor}99)`
              : undefined,
            boxShadow: !isViewed && isActive
              ? `0 0 20px ${brandColor}30, 0 4px 15px ${brandColor}20`
              : undefined,
            pointerEvents: 'auto',
            clipPath: shape === 'star' ? shapeClasses.clipPath : undefined
          }}
        >
          {/* Glass inner border */}
          <div className={cn(
            "w-full h-full bg-white/95 backdrop-blur-sm p-0.5 pointer-events-auto", 
            shape === 'star' ? 'rounded-lg' : shapeClasses.inner
          )}
          style={{
            clipPath: shape === 'star' ? shapeClasses.clipPath : undefined
          }}>
            <div className={cn(
              "w-full h-full overflow-hidden shadow-inner cursor-pointer relative", 
              shape === 'star' ? 'rounded-lg' : shapeClasses.image
            )}
            style={{
              clipPath: shape === 'star' ? shapeClasses.clipPath : undefined
            }}>
              {isDisplayVideo ? (
                <div className="relative w-full h-full">
                  {/* Video preview - use story.image as thumbnail for cover videos */}
                  <img 
                    src={isCoverVideo ? story.image : story.image} // Always use story.image for thumbnail
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    style={{ pointerEvents: 'none' }}
                    onError={(e) => {
                      console.warn(`[Template8StoryCard] Image failed to load for story ${story.id}:`, story.image);
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400";
                    }}
                  />
                  
                  {/* Video overlay indicator */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Video type badge */}
                  <div className="absolute top-1 right-1 bg-black/70 backdrop-blur-sm rounded-full p-1">
                    <Video className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                </div>
              ) : (
                <img 
                  src={displayMedia} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  style={{ pointerEvents: 'none' }}
                  onError={(e) => {
                    console.warn(`[Template8StoryCard] Image failed to load for story ${story.id}:`, displayMedia);
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400";
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile-responsive active indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <div
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 shadow-lg border border-white sm:border-2",
                shape === 'square' ? 'rounded-sm' : shape === 'star' ? 'rounded-sm' : 'rounded-full'
              )}
              style={{ 
                backgroundColor: brandColor,
                clipPath: shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : undefined
              }}
            />
          </motion.div>
        )}

        {/* Mobile-responsive new story badge */}
        {!isViewed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-pink-500 border border-white sm:border-2 shadow-md pointer-events-none",
              shape === 'square' || shape === 'star' ? 'rounded-lg' : 'rounded-full'
            )}
          >
            <div className={cn(
              "w-full h-full bg-red-500 animate-pulse opacity-80",
              shape === 'square' || shape === 'star' ? 'rounded-lg' : 'rounded-full'
            )} />
          </motion.div>
        )}
      </div>
      
      {/* Mobile-responsive story title */}
      <div className="text-center pointer-events-none max-w-[70px] sm:max-w-[90px] md:max-w-[100px]">
        {isEditMode ? (
          <EditableText
            value={story.title}
            onChange={handleTitleChange}
            tag="span"
            className={getTitleClasses()}
            style={getTitleColor()}
            placeholder="Story title"
          />
        ) : (
          <span
            className={getTitleClasses()}
            style={getTitleColor()}
          >
            {story.title}
          </span>
        )}
        
        {story.ctaText && (
          <>
            {isEditMode ? (
              <EditableText
                value={story.ctaText}
                onChange={handleCTAChange}
                tag="span"
                className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 block leading-tight"
                placeholder="CTA text"
              />
            ) : (
              <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 block leading-tight">
                {story.ctaText}
              </span>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Template8StoryCard;

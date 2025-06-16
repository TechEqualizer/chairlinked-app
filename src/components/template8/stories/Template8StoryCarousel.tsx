
import React from "react";
import { motion } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Template8StoryCard from "./Template8StoryCard";
import { InstagramStory } from "../types/storyTypes";

interface Template8StoryCarouselProps {
  stories: InstagramStory[];
  activeIndex: number;
  viewedStories: number[];
  onStoryClick: (id: number, index: number) => void;
  onActiveIndexChange: (index: number) => void;
  brandColor: string;
  fontClass: string;
  shape?: 'circle' | 'square' | 'star';
  onStoryUpdate?: (storyId: number, updates: Partial<InstagramStory>) => void;
}

const Template8StoryCarousel: React.FC<Template8StoryCarouselProps> = ({
  stories,
  activeIndex,
  viewedStories,
  onStoryClick,
  onActiveIndexChange,
  brandColor,
  fontClass,
  shape = 'circle',
  onStoryUpdate,
}) => {
  const isMobile = useIsMobile();

  // Dynamic layout logic: use flexbox for few stories, carousel for many
  const maxStoriesForFlexLayout = isMobile ? 4 : 6;
  const shouldUseFlexLayout = stories.length <= maxStoriesForFlexLayout;

  console.log('[Template8StoryCarousel] Rendering with:', {
    storiesCount: stories.length,
    activeIndex,
    viewedStoriesCount: viewedStories.length,
    shape,
    shouldUseFlexLayout,
    maxStoriesForFlexLayout,
    stories: stories.map(s => ({ id: s.id, title: s.title }))
  });

  // Flex layout for few stories with equal distribution
  if (shouldUseFlexLayout) {
    return (
      <motion.div 
        className="relative w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Background gradient */}
        <div 
          className="absolute inset-0 rounded-3xl blur-3xl opacity-20 -z-10"
          style={{
            background: `radial-gradient(ellipse at center, ${brandColor}20 0%, transparent 70%)`
          }}
        />
        
        <div className={cn(
          "flex w-full py-6 px-4 relative",
          stories.length === 1 ? "justify-center" :
          stories.length === 2 ? "justify-center gap-12 sm:gap-20" :
          stories.length === 3 ? "justify-center gap-8 sm:gap-16" :
          "justify-evenly"
        )}>
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="flex-shrink-0"
            >
              <Template8StoryCard
                story={story}
                index={index}
                isActive={activeIndex === index}
                isViewed={viewedStories.includes(story.id)}
                onClick={onStoryClick}
                brandColor={brandColor}
                fontClass={fontClass}
                shape={shape}
                onStoryUpdate={onStoryUpdate}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Carousel layout for many stories
  return (
    <motion.div 
      className="relative w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 rounded-3xl blur-3xl opacity-20 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${brandColor}20 0%, transparent 70%)`
        }}
      />

      <div className="px-4">
        <Carousel 
          className="w-full" 
          setActiveIndex={onActiveIndexChange}
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
            skipSnaps: false,
          }}
        >
          <CarouselContent className="ml-0 gap-6 sm:gap-8 py-6">
            {stories.map((story, index) => (
              <CarouselItem 
                key={story.id} 
                className={cn(
                  "pl-0 basis-auto",
                  isMobile ? "min-w-[100px]" : "min-w-[120px]"
                )}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 120
                  }}
                >
                  <Template8StoryCard
                    story={story}
                    index={index}
                    isActive={activeIndex === index}
                    isViewed={viewedStories.includes(story.id)}
                    onClick={onStoryClick}
                    brandColor={brandColor}
                    fontClass={fontClass}
                    shape={shape}
                    onStoryUpdate={onStoryUpdate}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Enhanced navigation arrows */}
          <CarouselPrevious
            className={cn(
              "absolute -left-6 top-[50px] -translate-y-1/2 w-10 h-10",
              "bg-white/90 hover:bg-white backdrop-blur-lg",
              "border-2 shadow-2xl text-gray-600 hover:text-gray-800",
              "transition-all duration-300 hover:scale-110 hover:-translate-x-1"
            )}
            style={{
              borderColor: `${brandColor}20`,
              boxShadow: `0 8px 32px ${brandColor}15, 0 4px 16px rgba(0,0,0,0.1)`
            }}
          />
          <CarouselNext
            className={cn(
              "absolute -right-6 top-[50px] -translate-y-1/2 w-10 h-10",
              "bg-white/90 hover:bg-white backdrop-blur-lg",
              "border-2 shadow-2xl text-gray-600 hover:text-gray-800",
              "transition-all duration-300 hover:scale-110 hover:translate-x-1"
            )}
            style={{
              borderColor: `${brandColor}20`,
              boxShadow: `0 8px 32px ${brandColor}15, 0 4px 16px rgba(0,0,0,0.1)`
            }}
          />
        </Carousel>
      </div>
    </motion.div>
  );
};

export default Template8StoryCarousel;

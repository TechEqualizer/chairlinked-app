import React from "react";
import { InstagramStory } from "../../types/storyTypes";
import { getDefaultStories, getDefaultStory } from "./DefaultStoriesProvider";

interface StoriesDataProcessorProps {
  pageData: any;
  children: (stories: InstagramStory[]) => React.ReactNode;
}

const StoriesDataProcessor: React.FC<StoriesDataProcessorProps> = ({
  pageData,
  children
}) => {
  // Enhanced safety checks for stories data with comprehensive fallback
  const stories: InstagramStory[] = React.useMemo(() => {
    try {
      // Check if pageData exists and has stories
      if (!pageData) {
        console.warn('[StoriesDataProcessor] No pageData provided');
        return getDefaultStories();
      }

      // Check if stories is a valid array
      if (!Array.isArray(pageData.stories)) {
        console.warn('[StoriesDataProcessor] Stories is not an array:', pageData.stories);
        return getDefaultStories();
      }

      // Check if stories array is empty
      if (pageData.stories.length === 0) {
        console.info('[StoriesDataProcessor] Stories array is empty, using defaults');
        return getDefaultStories();
      }

      // Validate each story has required properties
      const validatedStories = pageData.stories.map((story: any, index: number) => {
        if (!story || typeof story !== 'object') {
          console.warn(`[StoriesDataProcessor] Invalid story at index ${index}:`, story);
          return getDefaultStory(index);
        }

        console.log(`[StoriesDataProcessor] Processing story ${index}:`, {
          id: story.id,
          title: story.title,
          coverType: story.coverType,
          hasImage: !!story.image
        });

        const processedStory = {
          id: story.id || Date.now() + index,
          image: story.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          coverType: story.coverType || 'image', // Preserve coverType field
          title: story.title || `Story ${index + 1}`,
          ctaText: story.ctaText || "Learn More",
          items: Array.isArray(story.items) && story.items.length > 0 
            ? story.items.map((item: any, itemIndex: number) => {
                // Preserve exact duration values set by user, including longer durations
                const preservedDuration = typeof item?.duration === 'number' ? item.duration : null;
                // Use 60 seconds default for videos, 5 for images
                const calculatedDuration = preservedDuration !== null 
                  ? preservedDuration 
                  : (item?.type === "video" ? 60 : 5);
                
                console.log(`[StoriesDataProcessor] Item ${itemIndex} duration:`, {
                  originalDuration: item?.duration,
                  preservedDuration,
                  calculatedDuration,
                  itemType: item?.type
                });

                return {
                  type: (item?.type === "video" ? "video" : "image") as "image" | "video",
                  media: item?.media || "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
                  // Use the calculated duration that preserves user settings
                  duration: calculatedDuration,
                  caption: item?.caption || `Story content ${itemIndex + 1}`
                };
              })
            : [{
                type: "image" as const,
                media: story.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
                // Use 60 seconds for video covers, 5 for image covers
                duration: story.coverType === 'video' ? 60 : 5,
                caption: story.title ? `${story.title} content` : "Story content"
              }]
        };

        // Sync cover video with first item if needed, preserving durations
        if (processedStory.coverType === 'video' && processedStory.items.length > 0) {
          // Ensure the first item matches the cover video
          if (processedStory.items[0].type !== 'video' || processedStory.items[0].media !== processedStory.image) {
            // Preserve the existing duration if it was set by the user, otherwise use 60 seconds for videos
            const existingDuration = processedStory.items[0].duration;
            processedStory.items[0] = {
              type: 'video',
              media: processedStory.image,
              // Keep existing duration or use 60 seconds default for videos
              duration: typeof existingDuration === 'number' ? existingDuration : 60,
              caption: processedStory.items[0].caption || (processedStory.title ? `${processedStory.title} content` : "Video story content")
            };
            
            console.log(`[StoriesDataProcessor] Synced video cover with first item for story ${processedStory.id}, preserved duration: ${processedStory.items[0].duration}`);
          }
        }

        return processedStory;
      });

      console.log('[StoriesDataProcessor] Final validated stories:', validatedStories.map(s => ({ 
        id: s.id, 
        title: s.title, 
        coverType: s.coverType,
        hasItems: s.items?.length,
        firstItemType: s.items?.[0]?.type,
        firstItemDuration: s.items?.[0]?.duration,
        firstItemMedia: s.items?.[0]?.media?.substring(0, 50) + '...'
      })));
      return validatedStories;
    } catch (error) {
      console.error('[StoriesDataProcessor] Error processing stories:', error);
      return getDefaultStories();
    }
  }, [pageData?.stories]);

  return <>{children(stories)}</>;
};

export default StoriesDataProcessor;

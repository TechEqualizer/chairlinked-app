
import { useState, useEffect, useMemo } from "react";
import { InstagramStory } from "../../../types/storyTypes";

export const useStoriesManager = (pageData: any) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  
  // Ensure we always have a valid stories array with safety checks
  const stories: InstagramStory[] = useMemo(() => {
    if (!pageData || !Array.isArray(pageData.stories) || pageData.stories.length === 0) {
      // Return default story if no valid stories exist
      return [{
        id: Date.now(),
        image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
        title: "Default Story",
        ctaText: "Learn More",
        items: [
          {
            type: "image",
            media: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
            duration: 5,
            caption: "Default story content"
          }
        ]
      }];
    }
    return pageData.stories;
  }, [pageData?.stories]);

  // Validate and adjust selected index when stories change
  useEffect(() => {
    if (selectedStoryIndex >= stories.length) {
      setSelectedStoryIndex(Math.max(0, stories.length - 1));
    }
  }, [stories.length, selectedStoryIndex]);

  // Safe access to current story with fallback
  const currentStory = useMemo(() => {
    if (!stories || stories.length === 0 || selectedStoryIndex < 0 || selectedStoryIndex >= stories.length) {
      return null;
    }
    return stories[selectedStoryIndex];
  }, [stories, selectedStoryIndex]);

  return {
    stories,
    selectedStoryIndex,
    setSelectedStoryIndex,
    currentStory
  };
};

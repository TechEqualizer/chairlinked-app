
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { InstagramStory } from '../../types/storyTypes';

interface UseStoryNavigationProps {
  stories: InstagramStory[];
  initialStoryIndex?: number;
  onStoryChange: (storyId: number) => void;
  onClose: () => void;
}

export const useStoryNavigation = ({
  stories,
  initialStoryIndex = 0,
  onStoryChange,
  onClose
}: UseStoryNavigationProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);

  const currentStory = stories && stories.length > currentStoryIndex ? stories[currentStoryIndex] : null;
  
  // Enhanced current item logic with improved fallback for video covers
  const currentItem = React.useMemo(() => {
    if (!currentStory) return null;
    
    // If no items exist but we have a video cover, create a fallback video item
    if (!currentStory.items || currentStory.items.length === 0) {
      if (currentStory.coverType === 'video' && currentStory.image) {
        console.log('[useStoryNavigation] Creating fallback video item from cover with 60s duration');
        return {
          type: 'video' as const,
          media: currentStory.image,
          // Use 60 seconds for video covers to ensure full playback
          duration: 60,
          caption: currentStory.title ? `${currentStory.title} content` : "Video story content"
        };
      }
      
      // Fallback image item
      return {
        type: 'image' as const,
        media: currentStory.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        duration: 5,
        caption: currentStory.title ? `${currentStory.title} content` : "Story content"
      };
    }
    
    const item = currentStory.items[currentItemIndex] || currentStory.items[0];
    console.log('[useStoryNavigation] Current item from story items:', {
      type: item?.type,
      duration: item?.duration,
      hasMedia: !!item?.media
    });
    
    return item || null;
  }, [currentStory, currentItemIndex]);

  // Reset when story changes
  useEffect(() => {
    setCurrentItemIndex(0);
    setMediaError(false);
  }, [currentStoryIndex]);

  // Update current story index when initialStoryIndex changes
  useEffect(() => {
    if (initialStoryIndex !== undefined && initialStoryIndex !== currentStoryIndex) {
      setCurrentStoryIndex(initialStoryIndex);
    }
  }, [initialStoryIndex]);

  // Move to next item or story
  const goToNextItem = useCallback(() => {
    if (!currentStory) return;

    const itemsLength = (currentStory.items && currentStory.items.length > 0) ? currentStory.items.length : 1;

    if (currentItemIndex < itemsLength - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setMediaError(false);
    } else {
      if (currentStoryIndex < stories.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
        onStoryChange(stories[currentStoryIndex + 1].id);
        setCurrentItemIndex(0);
        setMediaError(false);
      } else {
        onClose();
      }
    }
  }, [currentItemIndex, currentStoryIndex, stories, currentStory, onClose, onStoryChange]);

  // Move to previous item or story
  const goToPrevItem = useCallback(() => {
    if (!currentStory) return;

    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setMediaError(false);
    } else {
      if (currentStoryIndex > 0) {
        setCurrentStoryIndex(currentStoryIndex - 1);
        onStoryChange(stories[currentStoryIndex - 1].id);
        const prevStory = stories[currentStoryIndex - 1];
        const prevStoryItemsLength = (prevStory && prevStory.items && prevStory.items.length > 0) ? prevStory.items.length : 1;
        setCurrentItemIndex(prevStoryItemsLength - 1);
        setMediaError(false);
      }
    }
  }, [currentItemIndex, currentStoryIndex, stories, onStoryChange]);

  const handleMediaError = () => {
    setMediaError(true);
    console.log("Media failed to load:", currentItem?.media);
  };

  return {
    currentStoryIndex,
    currentItemIndex,
    currentStory,
    currentItem,
    mediaError,
    goToNextItem,
    goToPrevItem,
    handleMediaError,
    setMediaError
  };
};

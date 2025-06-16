
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { StoryViewerProps } from "../types/storyTypes";
import StoryViewerContainer from "./components/StoryViewerContainer";
import { useStoryProgress } from "./hooks/useStoryProgress";
import { useStoryKeyboard } from "./hooks/useStoryKeyboard";
import { useStoryNavigation } from "./hooks/useStoryNavigation";

const Template8StoryViewer: React.FC<StoryViewerProps> = ({
  stories = [],
  initialStoryIndex = 0,
  isOpen,
  onClose,
  onStoryChange,
  businessName,
  brandColor = "#8B5CF6",
  onBookingClick,
}) => {
  console.log('[Template8StoryViewer] Render state:', {
    isOpen,
    storiesCount: stories.length,
    initialStoryIndex,
    hasOnClose: typeof onClose === 'function'
  });

  const [isPaused, setIsPaused] = useState(false);

  // Use custom hooks for managing different aspects
  const {
    currentStoryIndex,
    currentItemIndex,
    currentStory,
    currentItem,
    mediaError,
    goToNextItem,
    goToPrevItem,
    handleMediaError
  } = useStoryNavigation({
    stories,
    initialStoryIndex,
    onStoryChange,
    onClose
  });

  // FIXED: Changed video fallback from 15 to 60 seconds
  const storyDuration = currentItem?.duration !== null && currentItem?.duration !== undefined 
    ? currentItem.duration 
    : (currentItem?.type === 'video' ? 60 : 5);
  
  console.log('[Template8StoryViewer] Duration calculation FIXED:', {
    rawDuration: currentItem?.duration,
    calculatedDuration: storyDuration,
    itemType: currentItem?.type,
    isVideo: currentItem?.type === 'video',
    usingFallback: currentItem?.duration === null || currentItem?.duration === undefined
  });

  const { progress, setProgress } = useStoryProgress({
    isOpen,
    isPaused,
    currentItemIndex,
    currentStoryIndex,
    storyDuration,
    onNext: goToNextItem
  });

  useStoryKeyboard({
    isOpen,
    onNext: goToNextItem,
    onPrevious: goToPrevItem,
    onClose
  });

  console.log('[Template8StoryViewer] Current story data:', {
    currentStoryIndex,
    currentStory: currentStory ? { id: currentStory.id, title: currentStory.title } : null,
    currentItem: currentItem ? { type: currentItem.type, hasMedia: !!currentItem.media, duration: currentItem.duration } : null
  });

  // Early return if no valid data
  if (!stories || stories.length === 0) {
    console.warn('[Template8StoryViewer] No stories available');
    return null;
  }

  if (!currentStory) {
    console.warn('[Template8StoryViewer] No current story available');
    return null;
  }

  const handleBookingCTA = () => {
    onBookingClick?.(currentStory.title);
    onClose();
  };

  const handleDialogOpenChange = (open: boolean) => {
    console.log('[Template8StoryViewer] Dialog open change:', open);
    if (!open) {
      onClose();
    }
  };

  const handleSkip = () => {
    goToNextItem();
  };

  // Add debugging for render
  console.log('[Template8StoryViewer] About to render Dialog with isOpen:', isOpen);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleDialogOpenChange}
      modal={true}
    >
      <DialogTitle className="sr-only">Story Viewer - {currentStory.title}</DialogTitle>
      <DialogContent 
        className={cn(
          "p-0 border-none bg-black text-white overflow-hidden flex items-center justify-center",
          // Template 3 approach: hidden on mobile, flex on desktop for proper centering
          "hidden sm:flex sm:max-w-[400px] sm:h-[712px] sm:rounded-3xl",
          // Mobile: fullscreen positioning without breaking desktop centering
          "max-sm:fixed max-sm:inset-0 max-sm:w-screen max-sm:h-screen max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none max-sm:flex"
        )}
        style={{ 
          zIndex: 99999
        }}
        aria-describedby="story-viewer-description"
        hideCloseButton
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div id="story-viewer-description" className="sr-only">
          Instagram-style story viewer. Swipe left/right or use arrow keys to navigate between stories.
        </div>
        
        <StoryViewerContainer
          currentStory={currentStory}
          currentItem={currentItem}
          currentStoryIndex={currentStoryIndex}
          storiesLength={stories.length}
          progress={progress}
          mediaError={mediaError}
          businessName={businessName}
          brandColor={brandColor}
          onNext={goToNextItem}
          onPrevious={goToPrevItem}
          onPause={setIsPaused}
          onClose={onClose}
          onMediaError={handleMediaError}
          onVideoEnd={goToNextItem}
          onBookingClick={handleBookingCTA}
          onSkip={handleSkip}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Template8StoryViewer;


import React from "react";
import { cn } from "@/lib/utils";
import { InstagramStory } from "../../types/storyTypes";
import StoryTouchHandler from "./StoryTouchHandler";
import StoryProgressIndicators from "./StoryProgressIndicators";
import StoryNavigationControls from "./StoryNavigationControls";
import StoryMediaDisplay from "./StoryMediaDisplay";
import StoryHeader from "./StoryHeader";
import StoryCaptionOverlay from "./StoryCaptionOverlay";
import StoryCTAButton from "./StoryCTAButton";

interface StoryViewerContainerProps {
  currentStory: InstagramStory;
  currentItem: any;
  currentStoryIndex: number;
  storiesLength: number;
  progress: number;
  mediaError: boolean;
  businessName?: string;
  brandColor: string;
  onNext: () => void;
  onPrevious: () => void;
  onPause: (paused: boolean) => void;
  onClose: () => void;
  onMediaError: () => void;
  onVideoEnd: () => void;
  onBookingClick: () => void;
  onSkip: () => void;
}

const StoryViewerContainer: React.FC<StoryViewerContainerProps> = ({
  currentStory,
  currentItem,
  currentStoryIndex,
  storiesLength,
  progress,
  mediaError,
  businessName,
  brandColor,
  onNext,
  onPrevious,
  onPause,
  onClose,
  onMediaError,
  onVideoEnd,
  onBookingClick,
  onSkip
}) => {
  return (
    <StoryTouchHandler
      onNext={onNext}
      onPrevious={onPrevious}
      onPause={onPause}
      className="relative w-full h-full flex flex-col bg-black sm:rounded-3xl overflow-hidden"
    >
      
      {/* Progress indicators */}
      {currentStory.items && (
        <StoryProgressIndicators
          items={currentStory.items}
          currentItemIndex={currentStory.items.findIndex(item => item === currentItem)}
          progress={progress}
        />
      )}
      
      {/* Header */}
      <StoryHeader
        businessName={businessName}
        storyTitle={currentStory.title}
        onClose={onClose}
      />

      {/* Story content with navigation */}
      <div className="relative flex-1 flex items-center justify-center">
        <StoryMediaDisplay
          item={currentItem}
          onError={onMediaError}
          onVideoEnd={onVideoEnd}
          hasError={mediaError}
          onSkip={onSkip}
        />

        <StoryNavigationControls
          canGoBack={currentStoryIndex > 0}
          canGoForward={currentStoryIndex < storiesLength - 1}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>

      {/* Caption overlay */}
      {currentItem && currentItem.caption && (
        <StoryCaptionOverlay caption={currentItem.caption} />
      )}

      {/* CTA Button */}
      <StoryCTAButton
        ctaText={currentStory.ctaText || "Get Started Now"}
        brandColor={brandColor}
        onClick={onBookingClick}
      />

      {/* Mobile swipe hint */}
      <div className="absolute bottom-20 sm:bottom-32 left-1/2 transform -translate-x-1/2 z-10 sm:hidden">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
          <span className="text-white/70 text-xs">← Swipe to navigate →</span>
        </div>
      </div>
    </StoryTouchHandler>
  );
};

export default StoryViewerContainer;

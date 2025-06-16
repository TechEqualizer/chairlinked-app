
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Template8StoryCard from "./Template8StoryCard";
import Template8StoryViewer from "./Template8StoryViewer";
import StoriesHeader from "./components/StoriesHeader";
import StoriesBackgroundElements from "./components/StoriesBackgroundElements";
import StoriesUsageHint from "./components/StoriesUsageHint";
import { InstagramStory } from "../types/storyTypes";
import { getThemeClasses, getIndustryThemeClasses } from "../utils/themeUtils";
import { IndustryDesignSystem } from "../design-system/services/IndustryDesignSystem";

interface Template8InstagramStoriesProps {
  stories: InstagramStory[];
  brandColor: string;
  fontClass: string;
  businessName: string;
  theme?: 'light' | 'dark' | 'industry';
  onBookingClick?: (item: any) => void;
  pageData?: any;
  onUpdate?: (updates: any) => void;
}

const Template8InstagramStories: React.FC<Template8InstagramStoriesProps> = ({
  stories,
  brandColor,
  fontClass,
  businessName,
  theme = 'light',
  onBookingClick,
  pageData,
  onUpdate
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());

  console.log('[Template8InstagramStories] Component rendered with:', {
    storiesCount: stories.length,
    theme,
    brandColor,
    businessName,
    currentStoryIndex,
    viewedStoriesCount: viewedStories.size
  });

  // Get theme-aware styling
  const industry = pageData?.industry;
  const themeClasses = theme === 'industry' && industry
    ? getIndustryThemeClasses(industry, 'stories', brandColor)
    : getThemeClasses(theme, brandColor, industry, 'stories');

  // Generate industry CSS if needed
  const industryCSS = theme === 'industry' && industry
    ? IndustryDesignSystem.generateIndustryCSS(industry, brandColor)
    : '';

  const openStory = (storyId: number, index: number) => {
    console.log(`[Template8InstagramStories] Opening story ${storyId} at index ${index}`);
    setCurrentStoryIndex(index);
    setViewedStories(prev => new Set([...prev, storyId]));
  };

  const closeStory = () => {
    console.log('[Template8InstagramStories] Closing story viewer');
    setCurrentStoryIndex(null);
  };

  // Handle story updates
  const handleStoryUpdate = (storyId: number, updates: Partial<InstagramStory>) => {
    if (!onUpdate) return;
    
    const updatedStories = stories.map(story => 
      story.id === storyId ? { ...story, ...updates } : story
    );
    
    onUpdate({ stories: updatedStories });
  };

  // Memoized story cards for performance
  const storyCards = useMemo(() => {
    return stories.map((story, index) => (
      <Template8StoryCard
        key={story.id}
        story={story}
        index={index}
        isActive={currentStoryIndex === index}
        isViewed={viewedStories.has(story.id)}
        onClick={openStory}
        brandColor={brandColor}
        fontClass={fontClass}
        shape={pageData?.storyShape || 'circle'}
        onStoryUpdate={handleStoryUpdate}
        theme={theme}
      />
    ));
  }, [stories, currentStoryIndex, viewedStories, brandColor, fontClass, pageData?.storyShape, theme]);

  return (
    <div className="relative">
      {/* Industry Theme CSS */}
      {industryCSS && (
        <style dangerouslySetInnerHTML={{ __html: industryCSS }} />
      )}
      
      <section 
        id="stories" 
        className={`relative py-16 lg:py-24 overflow-hidden ${themeClasses.background}`}
      >
        {/* Background Elements */}
        <StoriesBackgroundElements 
          brandColor={brandColor} 
          theme={theme}
          industry={industry}
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <StoriesHeader
            businessName={businessName}
            brandColor={brandColor}
            fontClass={fontClass}
            theme={theme}
            pageData={pageData}
            onUpdate={onUpdate}
          />

          {/* Stories Grid */}
          <div className="mt-12 lg:mt-16">
            <motion.div 
              className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {storyCards}
            </motion.div>
          </div>

          {/* Usage Hint */}
          <StoriesUsageHint theme={theme} brandColor={brandColor} />
        </div>
      </section>

      {/* Story Viewer Modal */}
      {currentStoryIndex !== null && (
        <Template8StoryViewer
          stories={stories}
          initialStoryIndex={currentStoryIndex}
          isOpen={true}
          onClose={closeStory}
          onStoryChange={() => {}}
          businessName={businessName}
          brandColor={brandColor}
          onBookingClick={onBookingClick}
        />
      )}
    </div>
  );
};

export default Template8InstagramStories;

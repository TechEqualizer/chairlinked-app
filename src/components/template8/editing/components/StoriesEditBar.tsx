
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";
import StorySelector from "./StorySelector";
import StoryContentEditor from "./StoryContentEditor";
import { useStoriesManager } from "./hooks/useStoriesManager";
import { InstagramStory } from "../../types/storyTypes";

interface StoriesEditBarProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  brandColor?: string;
}

const StoriesEditBar: React.FC<StoriesEditBarProps> = ({
  pageData,
  onUpdate,
  brandColor = "#8B5CF6"
}) => {
  const { stories, selectedStoryIndex, setSelectedStoryIndex, currentStory } = useStoriesManager(pageData);

  const handleAddStory = () => {
    try {
      const newStory: InstagramStory = {
        id: Date.now(),
        image: "", // No default image - user must add their own
        title: "New Story",
        ctaText: "Learn More",
        items: [] // Start with empty items array
      };

      const updatedStories = [...stories, newStory];
      onUpdate({ stories: updatedStories });
      setSelectedStoryIndex(updatedStories.length - 1);
    } catch (error) {
      console.error('Error adding story:', error);
    }
  };

  const handleReorderStories = (reorderedStories: InstagramStory[]) => {
    try {
      onUpdate({ stories: reorderedStories });
      // Adjust selected index if needed
      if (selectedStoryIndex >= 0 && selectedStoryIndex < stories.length) {
        const selectedStory = stories[selectedStoryIndex];
        const newIndex = reorderedStories.findIndex(story => story.id === selectedStory.id);
        if (newIndex >= 0) {
          setSelectedStoryIndex(newIndex);
        }
      }
    } catch (error) {
      console.error('Error reordering stories:', error);
    }
  };

  const handleStoryUpdate = (updatedStory: InstagramStory) => {
    try {
      if (!stories || selectedStoryIndex < 0 || selectedStoryIndex >= stories.length) {
        console.error('Invalid story index for update:', selectedStoryIndex);
        return;
      }
      
      const updatedStories = [...stories];
      updatedStories[selectedStoryIndex] = updatedStory;
      onUpdate({ stories: updatedStories });
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const handleRemoveStory = () => {
    try {
      if (stories.length <= 1) {
        console.warn('Cannot remove the last story');
        return;
      }
      
      const updatedStories = stories.filter((_, i) => i !== selectedStoryIndex);
      onUpdate({ stories: updatedStories });
      setSelectedStoryIndex(Math.max(0, selectedStoryIndex - 1));
    } catch (error) {
      console.error('Error removing story:', error);
    }
  };

  // Early return with error state if no valid current story
  if (!currentStory) {
    return (
      <div className="space-y-6">
        <EditingGlassCard variant="content" className="p-4">
          <div className="text-center text-gray-500">
            <p>Unable to load story data</p>
            <Button
              onClick={handleAddStory}
              size="sm"
              className="mt-2"
              style={{ backgroundColor: brandColor }}
            >
              <Plus size={14} className="mr-1" />
              Add First Story
            </Button>
          </div>
        </EditingGlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StorySelector
        stories={stories}
        selectedStoryIndex={selectedStoryIndex}
        onStorySelect={setSelectedStoryIndex}
        onAddStory={handleAddStory}
        onReorderStories={handleReorderStories}
        brandColor={brandColor}
      />

      <StoryContentEditor
        currentStory={currentStory}
        canRemove={stories.length > 1}
        onStoryUpdate={handleStoryUpdate}
        onRemoveStory={handleRemoveStory}
        brandColor={brandColor}
      />
    </div>
  );
};

export default StoriesEditBar;

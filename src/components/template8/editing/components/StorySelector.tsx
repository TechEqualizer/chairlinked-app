
import React from "react";
import { Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";
import { InstagramStory } from "../../types/storyTypes";

interface StorySelectorProps {
  stories: InstagramStory[];
  selectedStoryIndex: number;
  onStorySelect: (index: number) => void;
  onAddStory: () => void;
  onReorderStories: (stories: InstagramStory[]) => void;
  brandColor: string;
}

const StorySelector: React.FC<StorySelectorProps> = ({
  stories,
  selectedStoryIndex,
  onStorySelect,
  onAddStory,
  onReorderStories,
  brandColor
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newStories = [...stories];
    const [draggedStory] = newStories.splice(draggedIndex, 1);
    newStories.splice(index, 0, draggedStory);
    
    onReorderStories(newStories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <EditingGlassCard variant="content" className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Stories ({stories.length})</Label>
          <Button
            onClick={onAddStory}
            size="sm"
            className="text-xs"
            style={{ backgroundColor: brandColor }}
          >
            <Plus size={14} className="mr-1" />
            Add Story
          </Button>
        </div>
        
        <div className="space-y-2">
          {stories.map((story, index) => {
            if (!story || !story.id) {
              return null;
            }
            
            return (
              <div
                key={story.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative flex items-center gap-3 p-2 rounded-lg border-2 transition-all cursor-move ${
                  selectedStoryIndex === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                  <GripVertical size={16} />
                </div>
                
                <button
                  onClick={() => onStorySelect(index)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <img
                    src={story.image || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400"}
                    alt={story.title || "Story"}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{story.title || "Untitled"}</div>
                    <div className="text-xs text-gray-500">{story.items?.length || 0} items</div>
                  </div>
                </button>
                
                <div className="text-xs text-gray-400">#{index + 1}</div>
              </div>
            );
          })}
        </div>
        
        {stories.length > 1 && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Drag stories to reorder them
          </div>
        )}
      </div>
    </EditingGlassCard>
  );
};

export default StorySelector;

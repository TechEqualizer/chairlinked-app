
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";
import MediaUploadZone from "../MediaUploadZone";
import EnhancedStoryItemManager from "./EnhancedStoryItemManager";
import { InstagramStory } from "../../types/storyTypes";

interface StoryContentEditorProps {
  currentStory: InstagramStory;
  canRemove: boolean;
  onStoryUpdate: (updatedStory: InstagramStory) => void;
  onRemoveStory: () => void;
  brandColor: string;
}

const StoryContentEditor: React.FC<StoryContentEditorProps> = ({
  currentStory,
  canRemove,
  onStoryUpdate,
  onRemoveStory,
  brandColor
}) => {
  const handleTitleChange = (value: string) => {
    onStoryUpdate({
      ...currentStory,
      title: value
    });
  };

  const handleCTAChange = (value: string) => {
    onStoryUpdate({
      ...currentStory,
      ctaText: value
    });
  };

  const handleMediaChange = (mediaUrl: string, type: 'image' | 'video') => {
    // Create updated story with new cover media
    const updatedStory = {
      ...currentStory,
      image: mediaUrl,
      coverType: type
    };

    // If it's a video, ensure the first item is also a video with the same media
    if (type === 'video') {
      const updatedItems = [...(currentStory.items || [])];
      
      // Update or create the first item as a video with 60-second duration
      if (updatedItems.length === 0) {
        updatedItems.push({
          type: 'video',
          media: mediaUrl,
          duration: 60, // Default 60 seconds for video uploads
          caption: currentStory.title ? `${currentStory.title} content` : "Video story content"
        });
      } else {
        updatedItems[0] = {
          type: 'video',
          media: mediaUrl,
          duration: updatedItems[0].duration || 60, // Use existing or default to 60 seconds
          caption: updatedItems[0].caption || (currentStory.title ? `${currentStory.title} content` : "Video story content")
        };
      }
      
      updatedStory.items = updatedItems;
    } else {
      // If it's an image, update the first item to be an image
      const updatedItems = [...(currentStory.items || [])];
      
      if (updatedItems.length === 0) {
        updatedItems.push({
          type: 'image',
          media: mediaUrl,
          duration: 5,
          caption: currentStory.title ? `${currentStory.title} content` : "Story content"
        });
      } else {
        updatedItems[0] = {
          type: 'image',
          media: mediaUrl,
          duration: updatedItems[0].duration || 5,
          caption: updatedItems[0].caption || (currentStory.title ? `${currentStory.title} content` : "Story content")
        };
      }
      
      updatedStory.items = updatedItems;
    }

    console.log('[StoryContentEditor] Updated story with synced items:', {
      coverType: updatedStory.coverType,
      coverMedia: updatedStory.image,
      firstItem: updatedStory.items?.[0],
      firstItemDuration: updatedStory.items?.[0]?.duration
    });

    onStoryUpdate(updatedStory);
  };

  const handleItemsUpdate = (newItems: any[]) => {
    onStoryUpdate({
      ...currentStory,
      items: newItems
    });
  };

  return (
    <EditingGlassCard variant="content" className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Edit Story Content</Label>
          {canRemove && (
            <Button
              onClick={onRemoveStory}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 text-xs"
            >
              <Trash2 size={14} className="mr-1" />
              Remove
            </Button>
          )}
        </div>

        {/* Story Title */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Story Title</Label>
          <Input
            value={currentStory.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter story title..."
            className="text-sm"
          />
        </div>

        {/* Story CTA */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">CTA Button Text</Label>
          <Input
            value={currentStory.ctaText || ""}
            onChange={(e) => handleCTAChange(e.target.value)}
            placeholder="e.g. Book Now, Learn More..."
            className="text-sm"
          />
        </div>

        {/* Story Cover Media */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Story Cover Image/Video</Label>
          <MediaUploadZone
            currentMedia={currentStory.image || ""}
            mediaType={currentStory.coverType || 'image'}
            onMediaChange={handleMediaChange}
            aspectRatio="1:1"
            brandColor={brandColor}
            showDimensionHint={false}
            className="max-h-32"
            acceptVideo={true}
          />
          {currentStory.coverType === 'video' && (
            <p className="text-xs text-gray-500 mt-1">
              Video will automatically be added as the first story item for playback (up to 60 seconds)
            </p>
          )}
        </div>

        {/* Enhanced Story Items Manager */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Manage Story Items</Label>
          <EnhancedStoryItemManager
            items={currentStory.items || []}
            onItemsUpdate={handleItemsUpdate}
            brandColor={brandColor}
            storyTitle={currentStory.title || "Story"}
          />
        </div>
      </div>
    </EditingGlassCard>
  );
};

export default StoryContentEditor;

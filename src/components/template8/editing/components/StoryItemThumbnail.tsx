
import React, { useState, useEffect } from "react";
import { Play, Image as ImageIcon, Type, Palette, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MediaUploadZone from "../MediaUploadZone";
import { StoryItem } from "../../types/storyTypes";

interface StoryItemThumbnailProps {
  item: StoryItem;
  index: number;
  onUpdate: (item: StoryItem) => void;
  brandColor: string;
  forceEditMode?: boolean;
  onEditModeClose?: () => void;
}

const StoryItemThumbnail: React.FC<StoryItemThumbnailProps> = ({
  item,
  index,
  onUpdate,
  brandColor,
  forceEditMode = false,
  onEditModeClose
}) => {
  const [isEditing, setIsEditing] = useState(forceEditMode);

  // Handle force edit mode
  useEffect(() => {
    if (forceEditMode) {
      setIsEditing(true);
    }
  }, [forceEditMode]);

  const handleMediaChange = (mediaUrl: string, type: 'image' | 'video') => {
    onUpdate({
      ...item,
      type: type,
      media: mediaUrl
    });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...item,
      caption: e.target.value
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value) || 5;
    const maxDuration = item.type === 'video' ? 60 : 10;
    onUpdate({
      ...item,
      duration: Math.max(1, Math.min(maxDuration, duration))
    });
  };

  const handleEditClose = () => {
    setIsEditing(false);
    if (onEditModeClose) {
      onEditModeClose();
    }
  };

  const getItemTypeIcon = () => {
    switch (item.type) {
      case 'video':
        return <Play size={12} className="text-white" />;
      case 'image':
        return <ImageIcon size={12} className="text-white" />;
      default:
        return <Type size={12} className="text-white" />;
    }
  };

  const isItemEmpty = !item.media || item.media.trim() === "";

  return (
    <>
      <div
        className={`aspect-[9/16] cursor-pointer relative overflow-hidden ${
          isItemEmpty ? 'bg-gray-100 border-2 border-dashed border-gray-300' : 'bg-gray-100'
        }`}
        onClick={() => setIsEditing(true)}
      >
        {item.media && !isItemEmpty ? (
          <>
            <img
              src={item.media}
              alt={item.caption || `Story item ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Handle broken images by showing empty state
                console.log('Image failed to load:', item.media);
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Type indicator */}
            <div className="absolute top-2 left-2">
              <div className="bg-black/60 rounded-full p-1">
                {getItemTypeIcon()}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-xs">Click to add media</p>
            </div>
          </div>
        )}

        {/* Caption overlay */}
        {item.caption && !isItemEmpty && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white text-xs line-clamp-2">{item.caption}</p>
          </div>
        )}

        {/* Empty state overlay */}
        {isItemEmpty && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90">
            <div className="text-center text-gray-500 p-4">
              <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium mb-1">No media selected</p>
              <p className="text-xs">Click to upload an image or video</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => {
        if (!open) {
          handleEditClose();
        }
      }}>
        <DialogContent className="max-w-md bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle>Edit Story Item #{index + 1}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Media Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Media</Label>
              <MediaUploadZone
                currentMedia={item.media}
                mediaType={item.type}
                onMediaChange={handleMediaChange}
                aspectRatio="9:16"
                brandColor={brandColor}
                showDimensionHint={false}
                className="max-h-48"
                acceptVideo={true}
              />
              {isItemEmpty && (
                <p className="text-xs text-orange-600 mt-1">
                  Please upload an image or video for this story item.
                </p>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-sm font-medium text-gray-700">
                Caption
              </Label>
              <Input
                id="caption"
                value={item.caption || ""}
                onChange={handleCaptionChange}
                placeholder="Enter story caption..."
                className="w-full"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration (seconds) - {item.type === 'video' ? 'Max 60s for videos' : 'Max 10s for images'}
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max={item.type === 'video' ? "60" : "10"}
                value={item.duration || (item.type === 'video' ? 15 : 5)}
                onChange={handleDurationChange}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleEditClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditClose}
                style={{ backgroundColor: brandColor }}
                className="text-white hover:opacity-90"
                disabled={isItemEmpty}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryItemThumbnail;

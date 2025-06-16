
import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Template8GalleryImage, Template8Category } from "../../hooks/useTemplate8Data";
import MediaUploadZone from "../MediaUploadZone";

interface GalleryItemPanelProps {
  item: Template8GalleryImage;
  itemIndex: number;
  categories: Template8Category[];
  onImageUpdate: (index: number, url: string, mediaType?: 'image' | 'video') => void;
  onCaptionUpdate: (index: number, caption: string) => void;
  onCategoryUpdate: (index: number, categoryName: string) => void;
  onRemoveImage: (index: number) => void;
  brandColor: string;
  onClose: () => void;
}

const GalleryItemPanel: React.FC<GalleryItemPanelProps> = ({
  item,
  itemIndex,
  categories,
  onImageUpdate,
  onCaptionUpdate,
  onCategoryUpdate,
  onRemoveImage,
  brandColor,
  onClose
}) => {
  // Add null safety check for item
  if (!item || typeof item !== 'object') {
    console.error('[GalleryItemPanel] Invalid item received:', item);
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed top-20 right-20 w-[480px] max-w-[90vw] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Edit Gallery Item</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="text-center text-red-500 py-8">
          <p>Unable to load gallery item</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </motion.div>
    );
  }

  const handleMediaChange = (mediaUrl: string, mediaType: 'image' | 'video') => {
    try {
      onImageUpdate(itemIndex, mediaUrl, mediaType);
    } catch (error) {
      console.error('[GalleryItemPanel] Error updating media:', error);
    }
  };

  const handleRemove = () => {
    try {
      onRemoveImage(itemIndex);
      onClose();
    } catch (error) {
      console.error('[GalleryItemPanel] Error removing item:', error);
    }
  };

  const handleCaptionChange = (caption: string) => {
    try {
      onCaptionUpdate(itemIndex, caption);
    } catch (error) {
      console.error('[GalleryItemPanel] Error updating caption:', error);
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    try {
      onCategoryUpdate(itemIndex, categoryName);
    } catch (error) {
      console.error('[GalleryItemPanel] Error updating category:', error);
    }
  };

  // Provide fallback values for potentially missing properties
  const imageUrl = item.image || "";
  const mediaType = item.mediaType || 'image';
  const caption = item.caption || "";
  const category = item.category || (categories[0]?.name || "Uncategorized");
  const likes = item.likes || 0;
  const dislikes = item.dislikes || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-[480px] max-w-[90vw] max-h-[calc(100vh-120px)] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Edit Gallery Item</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Media Upload - Removed fixed height constraint */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Media</Label>
          <MediaUploadZone
            currentMedia={imageUrl}
            mediaType={mediaType}
            onMediaChange={handleMediaChange}
            aspectRatio="1:1"
            brandColor={brandColor}
          />
        </div>

        {/* Caption Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Caption</Label>
          <Input
            value={caption}
            onChange={(e) => handleCaptionChange(e.target.value)}
            placeholder="Caption..."
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            {caption.length}/150 characters
          </p>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Engagement</Label>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>❤️ {likes}</span>
            <span>👎 {dislikes}</span>
            <span>{mediaType === 'video' ? '🎥' : '📷'}</span>
          </div>
        </div>

        {/* Remove Button */}
        <div className="pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleRemove}
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Remove Item
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryItemPanel;

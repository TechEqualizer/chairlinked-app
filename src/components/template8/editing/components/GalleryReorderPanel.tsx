
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, GripVertical, Image as ImageIcon, Heart, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Template8GalleryImage } from "../../hooks/useTemplate8Data";

interface GalleryReorderPanelProps {
  images: Template8GalleryImage[];
  onReorderImages: (images: Template8GalleryImage[]) => void;
  brandColor?: string;
  onClose: () => void;
}

const GalleryReorderPanel: React.FC<GalleryReorderPanelProps> = ({
  images,
  onReorderImages,
  brandColor = "#8B5CF6",
  onClose
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onReorderImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-20 top-1/2 transform -translate-y-1/2 z-40 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[80vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} style={{ color: brandColor }} />
          <div>
            <Label className="text-sm font-medium">Reorder Gallery</Label>
            <p className="text-xs text-gray-500">{images.length} images</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {images.length > 1 && (
            <div className="text-xs text-gray-500 text-center pb-2 border-b">
              Drag images to reorder your gallery
            </div>
          )}
          
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border cursor-move transition-all hover:shadow-md ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
              </div>
              
              <img
                src={image.image}
                alt={`Gallery item ${index + 1}`}
                className="w-16 h-16 object-cover rounded border flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {image.category || "Uncategorized"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart size={12} /> {image.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown size={12} /> {image.dislikes}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {image.caption || "No caption"}
                </p>
              </div>
              
              <div className="flex-shrink-0 text-xs text-gray-400 font-mono">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={onClose}
          className="w-full"
          style={{ backgroundColor: brandColor }}
        >
          Done Reordering
        </Button>
      </div>
    </motion.div>
  );
};

export default GalleryReorderPanel;


import React from "react";
import { motion } from "framer-motion";
import { Play, Image as ImageIcon, Clock, GripVertical, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StoryItem } from "../../types/storyTypes";

interface StoryItemSequenceViewProps {
  items: StoryItem[];
  selectedItems: number[];
  onItemsUpdate: (items: StoryItem[]) => void;
  onSelectItem: (index: number) => void;
  brandColor: string;
  storyTitle: string;
}

const StoryItemSequenceView: React.FC<StoryItemSequenceViewProps> = ({
  items,
  selectedItems,
  onItemsUpdate,
  onSelectItem,
  brandColor,
  storyTitle
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    onItemsUpdate(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getTotalDurationUpTo = (index: number) => {
    return items.slice(0, index).reduce((total, item) => total + (item.duration || 5), 0);
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={14} className="text-blue-500" />;
      case 'image':
        return <ImageIcon size={14} className="text-green-500" />;
      default:
        return <ImageIcon size={14} className="text-gray-500" />;
    }
  };

  const isItemEmpty = (item: StoryItem) => {
    return !item.media || item.media.trim() === "";
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">{storyTitle} - Timeline View</h4>
        <div className="text-sm text-gray-600">
          Total duration: {items.reduce((total, item) => total + (item.duration || 5), 0)} seconds
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const startTime = getTotalDurationUpTo(index);
          const endTime = startTime + (item.duration || 5);
          const isEmpty = isItemEmpty(item);
          
          return (
            <motion.div
              key={index}
              layout
              className={`bg-white border rounded-lg p-3 transition-all ${
                selectedItems.includes(index) ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'
              } ${draggedIndex === index ? 'opacity-50' : ''} ${
                isEmpty ? 'border-orange-300 bg-orange-50' : ''
              }`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center gap-3">
                {/* Selection checkbox */}
                <Checkbox
                  checked={selectedItems.includes(index)}
                  onCheckedChange={() => onSelectItem(index)}
                />

                {/* Drag handle */}
                <div className="cursor-grab text-gray-400 hover:text-gray-600">
                  <GripVertical size={16} />
                </div>

                {/* Item number */}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    isEmpty ? 'bg-orange-500' : ''
                  }`}
                  style={{ backgroundColor: isEmpty ? undefined : brandColor }}
                >
                  {index + 1}
                </div>

                {/* Media thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.media && !isEmpty ? (
                    <img
                      src={item.media}
                      alt={item.caption || `Item ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getItemTypeIcon(item.type)}
                    <span className={`font-medium truncate ${isEmpty ? 'text-orange-700' : 'text-gray-800'}`}>
                      {isEmpty ? 'No media - click to edit' : (item.caption || `Story Item ${index + 1}`)}
                    </span>
                  </div>
                  <div className={`text-xs ${isEmpty ? 'text-orange-600' : 'text-gray-500'}`}>
                    {isEmpty ? 'Needs media' : `${item.type === 'video' ? 'Video' : 'Image'}`} • {item.duration || 5}s
                  </div>
                </div>

                {/* Timeline info */}
                <div className="text-right text-xs text-gray-500 flex-shrink-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock size={12} />
                    <span>{startTime}s - {endTime}s</span>
                  </div>
                  <div className="text-gray-400">
                    Duration: {item.duration || 5}s
                  </div>
                </div>
              </div>

              {/* Progress bar showing position in story */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all ${isEmpty ? 'bg-orange-400' : ''}`}
                    style={{
                      backgroundColor: isEmpty ? undefined : brandColor,
                      width: `${((item.duration || 5) / items.reduce((total, item) => total + (item.duration || 5), 0)) * 100}%`,
                      marginLeft: `${(startTime / items.reduce((total, item) => total + (item.duration || 5), 0)) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Empty state warning */}
              {isEmpty && (
                <div className="mt-2 p-2 bg-orange-100 rounded-md">
                  <p className="text-xs text-orange-700">
                    This story item needs media. Click to edit and upload an image or video.
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryItemSequenceView;

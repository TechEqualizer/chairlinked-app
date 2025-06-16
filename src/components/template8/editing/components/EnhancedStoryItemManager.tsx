
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical, Trash2, Copy, Eye, Move, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { StoryItem } from "../../types/storyTypes";
import StoryItemThumbnail from "./StoryItemThumbnail";
import StoryItemSequenceView from "./StoryItemSequenceView";

interface EnhancedStoryItemManagerProps {
  items: StoryItem[];
  onItemsUpdate: (items: StoryItem[]) => void;
  brandColor?: string;
  storyTitle?: string;
}

const EnhancedStoryItemManager: React.FC<EnhancedStoryItemManagerProps> = ({
  items,
  onItemsUpdate,
  brandColor = "#8B5CF6",
  storyTitle = "Story"
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'sequence'>('grid');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newItemEditingIndex, setNewItemEditingIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    const newItem: StoryItem = {
      type: "image",
      media: "", // No default stock image - empty so user must add media
      duration: 5,
      caption: ""
    };
    const newItems = [...items, newItem];
    onItemsUpdate(newItems);
    // Set the new item index for immediate editing
    setNewItemEditingIndex(newItems.length - 1);
  };

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

  const handleItemUpdate = (index: number, updatedItem: StoryItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onItemsUpdate(newItems);
    // Clear new item editing state once updated
    if (newItemEditingIndex === index) {
      setNewItemEditingIndex(null);
    }
  };

  const handleItemRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsUpdate(newItems);
    setSelectedItems(prev => prev.filter(i => i !== index));
    // Clear new item editing state if this item was being edited
    if (newItemEditingIndex === index) {
      setNewItemEditingIndex(null);
    }
  };

  const handleItemDuplicate = (index: number) => {
    const itemToDuplicate = { ...items[index] };
    const newItems = [...items];
    newItems.splice(index + 1, 0, itemToDuplicate);
    onItemsUpdate(newItems);
  };

  const handleBulkDelete = () => {
    const newItems = items.filter((_, index) => !selectedItems.includes(index));
    onItemsUpdate(newItems);
    setSelectedItems([]);
  };

  const handleSelectItem = (index: number) => {
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((_, index) => index));
    }
  };

  const getTotalDuration = () => {
    return items.reduce((total, item) => total + (item.duration || 5), 0);
  };

  const isItemEmpty = (item: StoryItem) => {
    return !item.media || item.media.trim() === "";
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium text-gray-700">
            Story Items ({items.length})
          </Label>
          <span className="text-xs text-gray-500">
            Total duration: {getTotalDuration()}s
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1" />
                Delete ({selectedItems.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </Button>
            </>
          )}
          
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-2 py-1 text-xs"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'sequence' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('sequence')}
              className="px-2 py-1 text-xs"
            >
              Sequence
            </Button>
          </div>
          
          <Button
            onClick={handleAddItem}
            size="sm"
            style={{ backgroundColor: brandColor }}
            className="text-white hover:opacity-90"
          >
            <Plus size={14} className="mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Bulk selection controls */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Checkbox
            checked={selectedItems.length === items.length}
            onCheckedChange={handleSelectAll}
            className="mr-2"
          />
          <Label className="text-xs text-gray-600">
            Select all items
          </Label>
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              layout
              className={`relative group border rounded-lg overflow-hidden ${
                selectedItems.includes(index) ? 'ring-2 ring-blue-500' : 'border-gray-200'
              } ${draggedIndex === index ? 'opacity-50' : ''} ${
                isItemEmpty(item) ? 'border-dashed border-orange-300 bg-orange-50' : ''
              }`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              {/* Selection checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedItems.includes(index)}
                  onCheckedChange={() => handleSelectItem(index)}
                  className="bg-white/90 border-gray-300"
                />
              </div>

              {/* Drag handle */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded p-1 cursor-grab">
                  <GripVertical size={14} className="text-gray-500" />
                </div>
              </div>

              {/* Story item thumbnail */}
              <StoryItemThumbnail
                item={item}
                index={index}
                onUpdate={(updatedItem) => handleItemUpdate(index, updatedItem)}
                brandColor={brandColor}
                forceEditMode={newItemEditingIndex === index}
                onEditModeClose={() => setNewItemEditingIndex(null)}
              />

              {/* Item actions */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="bg-white/90 p-1 h-auto">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <DropdownMenuItem onClick={() => handleItemDuplicate(index)}>
                      <Copy size={14} className="mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleItemRemove(index)} className="text-red-600">
                      <Trash2 size={14} className="mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Duration indicator */}
              <div className="absolute bottom-2 left-2">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.duration || 5}s
                </div>
              </div>

              {/* Empty state indicator */}
              {isItemEmpty(item) && (
                <div className="absolute inset-0 flex items-center justify-center bg-orange-50/90 pointer-events-none">
                  <div className="text-center text-orange-600">
                    <Plus size={20} className="mx-auto mb-1" />
                    <p className="text-xs font-medium">Add Media</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <StoryItemSequenceView
          items={items}
          selectedItems={selectedItems}
          onItemsUpdate={onItemsUpdate}
          onSelectItem={handleSelectItem}
          brandColor={brandColor}
          storyTitle={storyTitle}
        />
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Plus size={32} className="mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">No story items yet</p>
          <Button
            onClick={handleAddItem}
            style={{ backgroundColor: brandColor }}
            className="text-white hover:opacity-90"
          >
            Add Your First Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedStoryItemManager;

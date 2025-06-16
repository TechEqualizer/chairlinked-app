
import React, { useState } from "react";
import { Plus, Grid, Heart, ThumbsDown, X, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";
import { Template8GalleryImage } from "../../hooks/useTemplate8Data";

interface GalleryEditBarProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  brandColor?: string;
}

const GalleryEditBar: React.FC<GalleryEditBarProps> = ({
  pageData,
  onUpdate,
  brandColor = "#8B5CF6"
}) => {
  const images: Template8GalleryImage[] = pageData.images || [];
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("Creative Work");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const categories = ["Creative Work", "Behind the Scenes", "Client Work", "Tech Setup", "Process"];

  const handleQuickAdd = () => {
    if (!newImageUrl.trim()) return;
    
    const newImage: Template8GalleryImage = {
      id: images.length + 1,
      image: newImageUrl,
      likes: Math.floor(Math.random() * 200) + 50,
      dislikes: Math.floor(Math.random() * 20) + 5,
      caption: newCaption || "New creative work ✨",
      user: pageData.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
      category: newCategory
    };
    
    const updatedImages = [...images, newImage];
    onUpdate({ images: updatedImages });
    
    // Reset form
    setNewImageUrl("");
    setNewCaption("");
    setNewCategory("Creative Work");
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_: Template8GalleryImage, i: number) => i !== index);
    onUpdate({ images: updatedImages });
  };

  const handleReorderImages = (reorderedImages: Template8GalleryImage[]) => {
    onUpdate({ images: reorderedImages });
  };

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
    
    handleReorderImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setNewImageUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <EditingGlassCard variant="content" className="p-3">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="add" className="text-xs">Add Post</TabsTrigger>
          <TabsTrigger value="manage" className="text-xs">Manage ({images.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-3 mt-0">
          {/* Quick Upload */}
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1">
              <Plus size={12} /> Quick Add
            </Label>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Image URL or upload..."
                  className="h-8 text-xs pr-8"
                />
                <label className="absolute right-1 top-1 cursor-pointer">
                  <Upload size={12} className="text-gray-400 hover:text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <Button
                onClick={handleQuickAdd}
                disabled={!newImageUrl.trim()}
                size="sm"
                className="h-8 px-3 text-xs"
                style={{ backgroundColor: brandColor }}
              >
                Add
              </Button>
            </div>

            {/* Compact Options */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Caption</Label>
                <Input
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Optional caption..."
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-2 mt-0">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {images.length === 0 ? (
              <div className="text-center text-gray-500 text-xs py-6">
                No posts yet. Add some in the "Add Post" tab!
              </div>
            ) : (
              <>
                {images.length > 1 && (
                  <div className="text-xs text-gray-500 text-center pb-2 border-b">
                    Drag posts to reorder them
                  </div>
                )}
                {images.map((image: Template8GalleryImage, index: number) => (
                  <div 
                    key={image.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group flex gap-2 p-2 bg-gray-50 rounded border cursor-move transition-opacity ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                      <GripVertical size={14} />
                    </div>
                    
                    <img
                      src={image.image}
                      alt={`Post ${index + 1}`}
                      className="w-12 h-12 object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {image.category}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart size={10} /> {image.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown size={10} /> {image.dislikes}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">{image.caption}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                    
                    <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </EditingGlassCard>
  );
};

export default GalleryEditBar;

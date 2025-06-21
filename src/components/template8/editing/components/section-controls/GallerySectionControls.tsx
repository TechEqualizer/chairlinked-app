import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, 
  Grid, 
  Upload,
  Trash2,
  Plus,
  Move,
  Eye,
  EyeOff
} from 'lucide-react';

interface GallerySectionControlsProps {
  selectedElement: any;
  sectionData: any;
  onElementPropertyChange: (property: string, value: any) => void;
  onDataUpdate: (updates: any) => void;
}

const GallerySectionControls: React.FC<GallerySectionControlsProps> = ({
  selectedElement,
  sectionData,
  onElementPropertyChange,
  onDataUpdate
}) => {
  const { elementRole } = selectedElement;
  const galleryImages = sectionData.images || [];

  const handleAddImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400',
      alt: 'New gallery image',
      caption: 'Add your caption here',
      category: 'portfolio'
    };
    
    onDataUpdate({
      images: [...galleryImages, newImage]
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = galleryImages.filter((_: any, i: number) => i !== index);
    onDataUpdate({ images: updatedImages });
  };

  const handleImageUpdate = (index: number, field: string, value: string) => {
    const updatedImages = galleryImages.map((img: any, i: number) => 
      i === index ? { ...img, [field]: value } : img
    );
    onDataUpdate({ images: updatedImages });
  };

  const renderRoleSpecificControls = () => {
    switch (elementRole) {
      case 'image':
        // Get the image index if possible
        const imgElement = selectedElement.element as HTMLImageElement;
        const imageIndex = galleryImages.findIndex((img: any) => img.url === imgElement.src);
        const currentImage = imageIndex >= 0 ? galleryImages[imageIndex] : null;

        return (
          <div className="space-y-4">
            {currentImage && (
              <>
                <div>
                  <Label className="text-xs text-gray-400">Image URL</Label>
                  <Input
                    value={currentImage.url}
                    onChange={(e) => {
                      handleImageUpdate(imageIndex, 'url', e.target.value);
                      onElementPropertyChange('src', e.target.value);
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white text-xs"
                    placeholder="Enter image URL..."
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-400">Alt Text</Label>
                  <Input
                    value={currentImage.alt}
                    onChange={(e) => {
                      handleImageUpdate(imageIndex, 'alt', e.target.value);
                      onElementPropertyChange('alt', e.target.value);
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white text-xs"
                    placeholder="Describe this image..."
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-400">Caption</Label>
                  <Textarea
                    value={currentImage.caption}
                    onChange={(e) => handleImageUpdate(imageIndex, 'caption', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white resize-none text-xs"
                    rows={2}
                    placeholder="Add image caption..."
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Category</Label>
                  <Select
                    value={currentImage.category || 'portfolio'}
                    onValueChange={(value) => handleImageUpdate(imageIndex, 'category', value)}
                  >
                    <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="portfolio" className="text-white hover:bg-gray-600">Portfolio</SelectItem>
                      <SelectItem value="before-after" className="text-white hover:bg-gray-600">Before/After</SelectItem>
                      <SelectItem value="featured" className="text-white hover:bg-gray-600">Featured</SelectItem>
                      <SelectItem value="recent" className="text-white hover:bg-gray-600">Recent Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveImage(imageIndex)}
                  className="w-full text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Remove Image
                </Button>
              </>
            )}
          </div>
        );

      case 'caption':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-400">Caption Text</Label>
              <Textarea
                value={selectedElement.properties?.textContent || ''}
                onChange={(e) => onElementPropertyChange('textContent', e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-white resize-none"
                rows={2}
                placeholder="Enter image caption..."
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-400">Caption Style</Label>
              <Select
                value={selectedElement.properties?.fontSize?.replace('px', '') || '14'}
                onValueChange={(value) => onElementPropertyChange('fontSize', `${value}px`)}
              >
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="12" className="text-white hover:bg-gray-600">Small (12px)</SelectItem>
                  <SelectItem value="14" className="text-white hover:bg-gray-600">Regular (14px)</SelectItem>
                  <SelectItem value="16" className="text-white hover:bg-gray-600">Medium (16px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'title':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-400">Section Title</Label>
              <Input
                value={selectedElement.properties?.textContent || ''}
                onChange={(e) => onElementPropertyChange('textContent', e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                placeholder="Enter gallery title..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-400 text-sm">
            Gallery element selected
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <Image className="w-4 h-4" />
          Gallery Section
        </h4>
        <p className="text-xs text-gray-400">
          Editing: {elementRole} element
        </p>
      </div>

      {/* Role-specific Controls */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3">
          Content
        </h5>
        {renderRoleSpecificControls()}
      </div>

      {/* Gallery Management */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
          <Grid className="w-3 h-3" />
          Gallery Management
        </h5>
        
        <div className="space-y-3">
          <div className="text-xs text-gray-400">
            Total Images: {galleryImages.length}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddImage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-2" />
            Add New Image
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                // Implement gallery layout change
                onDataUpdate({ galleryLayout: 'grid' });
              }}
            >
              <Grid className="w-3 h-3 mr-1" />
              Grid
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                // Implement gallery layout change
                onDataUpdate({ galleryLayout: 'masonry' });
              }}
            >
              <Move className="w-3 h-3 mr-1" />
              Masonry
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Settings */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3">
          Gallery Settings
        </h5>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400">Images Per Row</Label>
            <Select
              value={sectionData.imagesPerRow?.toString() || '3'}
              onValueChange={(value) => onDataUpdate({ imagesPerRow: parseInt(value) })}
            >
              <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="2" className="text-white hover:bg-gray-600">2 columns</SelectItem>
                <SelectItem value="3" className="text-white hover:bg-gray-600">3 columns</SelectItem>
                <SelectItem value="4" className="text-white hover:bg-gray-600">4 columns</SelectItem>
                <SelectItem value="5" className="text-white hover:bg-gray-600">5 columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-400">Image Spacing</Label>
            <Select
              value={sectionData.imageSpacing || 'medium'}
              onValueChange={(value) => onDataUpdate({ imageSpacing: value })}
            >
              <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="tight" className="text-white hover:bg-gray-600">Tight</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-600">Medium</SelectItem>
                <SelectItem value="loose" className="text-white hover:bg-gray-600">Loose</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-captions"
              checked={sectionData.showCaptions !== false}
              onChange={(e) => onDataUpdate({ showCaptions: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="show-captions" className="text-xs text-gray-400">
              Show image captions
            </Label>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3">
          Quick Actions
        </h5>
        
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Apply hover effects to all gallery images
              const galleryImages = document.querySelectorAll('[data-section="gallery"] img');
              galleryImages.forEach(img => {
                (img as HTMLElement).style.transition = 'transform 0.3s ease';
                (img as HTMLElement).style.cursor = 'pointer';
              });
            }}
            className="w-full text-xs"
          >
            <Eye className="w-3 h-3 mr-2" />
            Add Hover Effects
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Make all images the same aspect ratio
              const galleryImages = document.querySelectorAll('[data-section="gallery"] img');
              galleryImages.forEach(img => {
                (img as HTMLElement).style.aspectRatio = '1 / 1';
                (img as HTMLElement).style.objectFit = 'cover';
              });
            }}
            className="w-full text-xs"
          >
            <Grid className="w-3 h-3 mr-2" />
            Square Aspect Ratio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GallerySectionControls;
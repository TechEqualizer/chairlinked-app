import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, Image as ImageIcon, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
}

interface SimpleGalleryEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
}

export const SimpleGalleryEditor: React.FC<SimpleGalleryEditorProps> = ({
  sectionData,
  onSectionUpdate
}) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    sectionData.gallery?.images || [
      { id: '1', url: '', caption: '' }
    ]
  );

  const updateGallery = (updatedImages: GalleryImage[]) => {
    setGalleryImages(updatedImages);
    onSectionUpdate({ 
      gallery: { 
        ...sectionData.gallery,
        images: updatedImages 
      }
    });
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url: '',
      caption: ''
    };
    updateGallery([...galleryImages, newImage]);
  };

  const removeImage = (imageId: string) => {
    if (galleryImages.length > 1) {
      updateGallery(galleryImages.filter(img => img.id !== imageId));
    }
  };

  const updateImage = (imageId: string, field: keyof GalleryImage, value: string) => {
    updateGallery(
      galleryImages.map(image => 
        image.id === imageId 
          ? { ...image, [field]: value }
          : image
      )
    );
  };

  const moveImageUp = (index: number) => {
    if (index > 0) {
      const newImages = [...galleryImages];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      updateGallery(newImages);
    }
  };

  const moveImageDown = (index: number) => {
    if (index < galleryImages.length - 1) {
      const newImages = [...galleryImages];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      updateGallery(newImages);
    }
  };

  const handleImageUpload = (imageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you'd upload to a service like Cloudinary
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      updateImage(imageId, 'url', imageUrl);
    }
  };

  const addSampleImages = () => {
    const sampleImages: GalleryImage[] = [
      {
        id: 'sample-1',
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&w=800',
        caption: 'Before and after transformation'
      },
      {
        id: 'sample-2', 
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&w=800',
        caption: 'Professional styling work'
      },
      {
        id: 'sample-3',
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=800',
        caption: 'Client satisfaction'
      }
    ];
    updateGallery([...galleryImages.filter(img => img.url), ...sampleImages]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Show off your best work
        </h3>
        <p className="text-gray-600">
          Add photos that showcase your skills and help potential customers visualize your service.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Gallery Images</h4>
        <Button
          onClick={addSampleImages}
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-600 hover:bg-purple-50"
        >
          Add Sample Images
        </Button>
      </div>

      <div className="grid gap-4">
        {galleryImages.map((image, index) => (
          <Card key={image.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Image {index + 1}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {/* Reorder buttons */}
                  {galleryImages.length > 1 && (
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0}
                        className="h-6 px-1 py-0"
                        title="Move up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveImageDown(index)}
                        disabled={index === galleryImages.length - 1}
                        className="h-6 px-1 py-0"
                        title="Move down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  {/* Remove button */}
                  {galleryImages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`image-url-${image.id}`}>Image URL *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id={`image-url-${image.id}`}
                    value={image.url}
                    onChange={(e) => updateImage(image.id, 'url', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(image.id, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`image-caption-${image.id}`}>Caption (optional)</Label>
                <Input
                  id={`image-caption-${image.id}`}
                  value={image.caption || ''}
                  onChange={(e) => updateImage(image.id, 'caption', e.target.value)}
                  placeholder="Brief description of this image..."
                  className="mt-1"
                />
              </div>

              {image.url && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {image.caption && (
                      <div className="p-2 bg-gray-50">
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addImage}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Image
        </Button>
      </div>

      {/* Gallery Preview */}
      {galleryImages.some(img => img.url) && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Gallery Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages
                .filter(img => img.url)
                .slice(0, 6)
                .map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">💡</div>
          <div>
            <h4 className="font-medium text-blue-900">Gallery Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Use high-resolution, well-lit photos</li>
              <li>• Show a variety of your work and styles</li>
              <li>• Include before/after photos if applicable</li>
              <li>• Keep images consistently sized and professional</li>
              <li>• Add captions to provide context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
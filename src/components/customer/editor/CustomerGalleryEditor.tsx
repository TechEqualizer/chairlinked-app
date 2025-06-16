
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload, ExternalLink } from 'lucide-react';

interface CustomerGalleryEditorProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export const CustomerGalleryEditor: React.FC<CustomerGalleryEditorProps> = ({
  data,
  onUpdate
}) => {
  const images = data?.images || [];
  const heroImages = data?.heroImages || [];

  const handleImageUpdate = (index: number, field: string, value: any) => {
    const updatedImages = [...images];
    if (typeof updatedImages[index] === 'string') {
      // Convert string to object format
      updatedImages[index] = {
        image: updatedImages[index],
        caption: '',
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 20) + 5,
        user: data?.businessName?.toLowerCase().replace(/\s/g, "_") || 'user',
        category: 'Portfolio'
      };
    }
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    onUpdate({ images: updatedImages });
  };

  const handleHeroImageUpdate = (index: number, value: string) => {
    const updatedHeroImages = [...heroImages];
    updatedHeroImages[index] = value;
    onUpdate({ heroImages: updatedHeroImages });
  };

  const handleAddImage = () => {
    const newImage = {
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      caption: 'New portfolio piece ✨',
      likes: Math.floor(Math.random() * 300) + 50,
      comments: Math.floor(Math.random() * 20) + 5,
      user: data?.businessName?.toLowerCase().replace(/\s/g, "_") || 'user',
      category: 'Portfolio'
    };
    onUpdate({ images: [...images, newImage] });
  };

  const handleAddHeroImage = () => {
    const newHeroImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600';
    onUpdate({ heroImages: [...heroImages, newHeroImage] });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onUpdate({ images: updatedImages });
  };

  const handleRemoveHeroImage = (index: number) => {
    const updatedHeroImages = heroImages.filter((_, i) => i !== index);
    onUpdate({ heroImages: updatedHeroImages });
  };

  return (
    <div className="space-y-8">
      {/* Hero Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Hero Images</h3>
            <p className="text-sm text-gray-600">Main images shown in your hero section</p>
          </div>
          <Button onClick={handleAddHeroImage} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Hero Image
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroImages.map((image: string, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={image} 
                    alt={`Hero ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => handleHeroImageUpdate(index, e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHeroImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Gallery Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Portfolio Gallery</h3>
            <p className="text-sm text-gray-600">Your work showcase in Instagram-style gallery</p>
          </div>
          <Button onClick={handleAddImage} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image: any, index: number) => {
            const imageData = typeof image === 'string' ? { image, caption: '' } : image;
            
            return (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={imageData.image} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      value={imageData.image || ''}
                      onChange={(e) => handleImageUpdate(index, 'image', e.target.value)}
                      placeholder="Image URL"
                    />
                    <Input
                      value={imageData.caption || ''}
                      onChange={(e) => handleImageUpdate(index, 'caption', e.target.value)}
                      placeholder="Caption (e.g., Amazing transformation ✨)"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {imageData.likes || 0} likes • {imageData.comments || 0} comments
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {images.length === 0 && (
          <Card className="p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No gallery images yet</p>
            <Button onClick={handleAddImage} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Image
            </Button>
          </Card>
        )}
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Image Upload Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              For best results, upload your images to a service like Imgur, Cloudinary, or use direct URLs. 
              Recommended size: 800x800px for gallery images, 1200x800px for hero images.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, ArrowUp, ArrowDown, Image, Palette, Layout, Wand2, Star, Grid, Eye } from 'lucide-react';

interface AdvancedGalleryEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedGalleryEditor: React.FC<AdvancedGalleryEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [galleryData, setGalleryData] = useState({
    gallery: sectionData.gallery || { images: [] },
    sectionTitle: sectionData.sectionTitle || 'Our Work Gallery',
    sectionSubtitle: sectionData.sectionSubtitle || 'See examples of our professional work',
    galleryLayout: sectionData.galleryLayout || 'masonry',
    imageAspect: sectionData.imageAspect || 'auto',
    showCaptions: sectionData.showCaptions !== false,
    enableLightbox: sectionData.enableLightbox !== false,
    columnsDesktop: sectionData.columnsDesktop || 3,
    columnsMobile: sectionData.columnsMobile || 2,
    brandColor: sectionData.brandColor || '#8B5CF6',
    ...sectionData
  });

  const galleryImages = galleryData.gallery?.images || [];

  const updateGalleryData = (updates: any) => {
    const newData = { ...galleryData, ...updates };
    setGalleryData(newData);
    onSectionUpdate(newData);
  };

  const updateGallery = (newImages: any[]) => {
    updateGalleryData({ 
      gallery: { 
        ...galleryData.gallery, 
        images: newImages 
      } 
    });
  };

  const addImage = (imageData: any = {}) => {
    const newImage = {
      id: Date.now().toString(),
      url: imageData.url || '',
      caption: imageData.caption || '',
      alt: imageData.alt || '',
      category: imageData.category || '',
      featured: imageData.featured || false,
      ...imageData
    };
    updateGallery([...galleryImages, newImage]);
  };

  const updateImage = (imageId: string, field: string, value: any) => {
    const updatedImages = galleryImages.map((image: any) =>
      image.id === imageId ? { ...image, [field]: value } : image
    );
    updateGallery(updatedImages);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = galleryImages.filter((image: any) => image.id !== imageId);
    updateGallery(updatedImages);
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

  const renderImagesPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Stock Images</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {[
          { category: 'Hair Styling', images: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
            'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400'
          ]},
          { category: 'Beauty & Makeup', images: [
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
          ]},
          { category: 'Nails & Spa', images: [
            'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
            'https://images.unsplash.com/photo-1619451334792-150bdda93870?w=400',
            'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400'
          ]},
          { category: 'Photography', images: [
            'https://images.unsplash.com/photo-1542038784456-1ea8e732a8e?w=400',
            'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400',
            'https://images.unsplash.com/photo-1494790108755-2616c6f9e1bc?w=400'
          ]}
        ].map((category) => (
          <button
            key={category.category}
            onClick={() => {
              const newImages = category.images.map((url, index) => ({
                url,
                caption: `${category.category} ${index + 1}`,
                alt: `${category.category} work sample`,
                category: category.category,
                featured: index === 0
              }));
              newImages.forEach(image => addImage(image));
            }}
            className="p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-sm">{category.category}</div>
            <div className="text-xs text-gray-600 mt-1">
              Add {category.images.length} images
            </div>
          </button>
        ))}
      </div>

      <div>
        <Label>Image Categories</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {['Before/After', 'Portfolio', 'Studio', 'Process', 'Events', 'Products'].map((category) => (
            <button
              key={category}
              onClick={() => {
                // Add category to existing images
                const updatedImages = galleryImages.map((image: any) => ({
                  ...image,
                  category: category
                }));
                updateGallery(updatedImages);
              }}
              className="p-2 border rounded text-xs hover:bg-gray-50"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Gallery Layout</h4>
      
      <div>
        <Label>Layout Style</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Masonry', value: 'masonry' },
            { name: 'Grid', value: 'grid' },
            { name: 'Carousel', value: 'carousel' },
            { name: 'Mosaic', value: 'mosaic' }
          ].map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateGalleryData({ galleryLayout: layout.value })}
              className={`p-2 border rounded text-sm ${
                galleryData.galleryLayout === layout.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Desktop Columns</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[2, 3, 4, 5].map((cols) => (
            <button
              key={cols}
              onClick={() => updateGalleryData({ columnsDesktop: cols })}
              className={`p-2 border rounded text-sm ${
                galleryData.columnsDesktop === cols
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {cols}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Mobile Columns</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => updateGalleryData({ columnsMobile: cols })}
              className={`p-2 border rounded text-sm ${
                galleryData.columnsMobile === cols
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {cols}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Image Aspect Ratio</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Auto', value: 'auto' },
            { name: 'Square', value: 'square' },
            { name: 'Portrait', value: 'portrait' },
            { name: 'Landscape', value: 'landscape' }
          ].map((aspect) => (
            <button
              key={aspect.value}
              onClick={() => updateGalleryData({ imageAspect: aspect.value })}
              className={`p-2 border rounded text-sm ${
                galleryData.imageAspect === aspect.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {aspect.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Display Options</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={galleryData.showCaptions}
              onChange={(e) => updateGalleryData({ showCaptions: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show image captions</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={galleryData.enableLightbox}
              onChange={(e) => updateGalleryData({ enableLightbox: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Enable lightbox popup</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Gallery Styling</h4>
      
      <div>
        <Label htmlFor="brandColor">Accent Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="brandColor"
            type="color"
            value={galleryData.brandColor}
            onChange={(e) => updateGalleryData({ brandColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={galleryData.brandColor}
            onChange={(e) => updateGalleryData({ brandColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Hover Effects</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Zoom', value: 'zoom' },
            { name: 'Fade', value: 'fade' },
            { name: 'Slide', value: 'slide' },
            { name: 'None', value: 'none' }
          ].map((effect) => (
            <button
              key={effect.value}
              onClick={() => updateGalleryData({ hoverEffect: effect.value })}
              className={`p-2 border rounded text-sm ${
                galleryData.hoverEffect === effect.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {effect.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Section</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              value={galleryData.sectionTitle}
              onChange={(e) => updateGalleryData({ sectionTitle: e.target.value })}
              placeholder="Our Work Gallery"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
            <Textarea
              id="sectionSubtitle"
              value={galleryData.sectionSubtitle}
              onChange={(e) => updateGalleryData({ sectionSubtitle: e.target.value })}
              placeholder="See examples of our professional work"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Images List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Gallery Images</h4>
          <Button onClick={() => addImage()} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        <div className="space-y-4">
          {galleryImages.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">No images yet</h4>
                <p className="text-gray-600 mb-4">Add images to showcase your work</p>
                <Button onClick={() => addImage()} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Image
                </Button>
              </CardContent>
            </Card>
          ) : (
            galleryImages.map((image: any, index: number) => (
              <Card key={image.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Image {index + 1}</h5>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateImage(image.id, 'featured', !image.featured)}
                        className={`p-1 rounded ${
                          image.featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        title="Mark as featured"
                      >
                        <Star className="w-4 h-4" fill={image.featured ? 'currentColor' : 'none'} />
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0}
                        className="p-1"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveImageDown(index)}
                        disabled={index === galleryImages.length - 1}
                        className="p-1"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Label>Image URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={image.url}
                          onChange={(e) => updateImage(image.id, 'url', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const placeholderUrl = `https://images.unsplash.com/photo-${Date.now()}?w=600&h=400&fit=crop`;
                                updateImage(image.id, 'url', placeholderUrl);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Input
                        value={image.category}
                        onChange={(e) => updateImage(image.id, 'category', e.target.value)}
                        placeholder="e.g., Portfolio"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Caption</Label>
                      <Input
                        value={image.caption}
                        onChange={(e) => updateImage(image.id, 'caption', e.target.value)}
                        placeholder="Image caption (optional)"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Alt Text</Label>
                      <Input
                        value={image.alt}
                        onChange={(e) => updateImage(image.id, 'alt', e.target.value)}
                        placeholder="Alt text for accessibility"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {image.url && (
                    <div className="mt-4">
                      <img 
                        src={image.url} 
                        alt={image.alt || 'Gallery image'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Advanced Panel */}
      {activePanel && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {activePanel === 'images' && <Image className="w-4 h-4" />}
              {activePanel === 'layout' && <Layout className="w-4 h-4" />}
              {activePanel === 'brand' && <Palette className="w-4 h-4" />}
              <span className="capitalize">{activePanel} Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePanel === 'images' && renderImagesPanel()}
            {activePanel === 'layout' && renderLayoutPanel()}
            {activePanel === 'brand' && renderBrandPanel()}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {galleryData.sectionTitle}
            </h2>
            <p className="text-gray-600">
              {galleryData.sectionSubtitle}
            </p>
          </div>
          
          <div className={`grid gap-4 grid-cols-${galleryData.columnsMobile} md:grid-cols-${galleryData.columnsDesktop}`}>
            {galleryImages.slice(0, 6).map((image: any) => (
              <div 
                key={image.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`relative ${
                  galleryData.imageAspect === 'square' ? 'aspect-square' :
                  galleryData.imageAspect === 'portrait' ? 'aspect-[3/4]' :
                  galleryData.imageAspect === 'landscape' ? 'aspect-[4/3]' :
                  'aspect-[4/3]'
                }`}>
                  <img
                    src={image.url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                    alt={image.alt || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                  {galleryData.enableLightbox && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  {image.featured && (
                    <div className="absolute top-2 right-2">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                    </div>
                  )}
                </div>
                {galleryData.showCaptions && image.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-700">{image.caption}</p>
                    {image.category && (
                      <p className="text-xs text-gray-500 mt-1">{image.category}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {galleryImages.length > 6 && (
            <div className="text-center mt-6">
              <Button variant="outline">
                View More ({galleryImages.length - 6} more images)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Gallery Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Use high-quality images that showcase your best work</li>
              <li>• Organize images by categories for easy browsing</li>
              <li>• Feature your most impressive work with the star button</li>
              <li>• Add descriptive captions to provide context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
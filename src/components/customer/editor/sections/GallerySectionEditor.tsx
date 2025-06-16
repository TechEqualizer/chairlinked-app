
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Image } from 'lucide-react';
import { SimpleEditorData, GalleryItem } from '@/hooks/useSimpleCustomerEditor';
import { ImageUploadField } from '@/components/ui/ImageUploadField';

interface GallerySectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: any) => void;
}

export const GallerySectionEditor: React.FC<GallerySectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  const gallery = data.gallery || [];

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      url: '',
      type: 'image',
      title: 'Gallery Item',
      description: ''
    };
    onUpdateField('gallery', [...gallery, newItem]);
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: any) => {
    const updatedGallery = [...gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    onUpdateField('gallery', updatedGallery);
  };

  const removeGalleryItem = (index: number) => {
    const updatedGallery = gallery.filter((_, i) => i !== index);
    onUpdateField('gallery', updatedGallery);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🖼️ Gallery Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Add photos and videos to showcase your work
            </p>
            <Button onClick={addGalleryItem} size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Add Media
            </Button>
          </div>

          {gallery.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Image size={48} className="mx-auto mb-2 opacity-50" />
              <p>No gallery items added yet. Click "Add Media" to get started.</p>
            </div>
          )}

          <div className="grid gap-6">
            {gallery.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image size={16} className="text-blue-500" />
                    <Label className="font-medium">Gallery Item {index + 1}</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGalleryItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`gallery-type-${index}`}>Media Type</Label>
                  <Select
                    value={item.type}
                    onValueChange={(value: 'image' | 'video') => updateGalleryItem(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ImageUploadField
                  label={item.type === 'image' ? 'Gallery Image' : 'Video Thumbnail'}
                  value={item.url}
                  onChange={(url) => updateGalleryItem(index, 'url', url)}
                  placeholder={`Enter ${item.type} URL or upload file`}
                  aspectRatio="aspect-square"
                  showPreview={true}
                />

                <div className="space-y-2">
                  <Label htmlFor={`gallery-title-${index}`}>Title (Optional)</Label>
                  <Input
                    id={`gallery-title-${index}`}
                    value={item.title || ''}
                    onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                    placeholder="Media title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`gallery-description-${index}`}>Description (Optional)</Label>
                  <Input
                    id={`gallery-description-${index}`}
                    value={item.description || ''}
                    onChange={(e) => updateGalleryItem(index, 'description', e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

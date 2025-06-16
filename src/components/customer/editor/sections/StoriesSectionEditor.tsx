
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { SimpleEditorData, Story } from '@/hooks/useSimpleCustomerEditor';
import { ImageUploadField } from '@/components/ui/ImageUploadField';

interface StoriesSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: any) => void;
}

export const StoriesSectionEditor: React.FC<StoriesSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  const stories = data.stories || [];

  const addStory = () => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      imageUrl: '',
      title: 'New Story',
      isActive: true
    };
    onUpdateField('stories', [...stories, newStory]);
  };

  const updateStory = (index: number, field: keyof Story, value: any) => {
    const updatedStories = [...stories];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    onUpdateField('stories', updatedStories);
  };

  const removeStory = (index: number) => {
    const updatedStories = stories.filter((_, i) => i !== index);
    onUpdateField('stories', updatedStories);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📱 Stories Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Add Instagram-style stories to showcase your work
            </p>
            <Button onClick={addStory} size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Add Story
            </Button>
          </div>

          {stories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <p>No stories added yet. Click "Add Story" to get started.</p>
            </div>
          )}

          <div className="grid gap-6">
            {stories.map((story, index) => (
              <div key={story.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Story {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStory(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`story-title-${index}`}>Story Title</Label>
                  <Input
                    id={`story-title-${index}`}
                    value={story.title}
                    onChange={(e) => updateStory(index, 'title', e.target.value)}
                    placeholder="Story title"
                  />
                </div>

                <ImageUploadField
                  label="Story Image"
                  value={story.imageUrl}
                  onChange={(url) => updateStory(index, 'imageUrl', url)}
                  placeholder="Enter image URL or upload story image"
                  aspectRatio="aspect-[4/5]"
                  showPreview={true}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`story-active-${index}`}
                    checked={story.isActive}
                    onChange={(e) => updateStory(index, 'isActive', e.target.checked)}
                  />
                  <Label htmlFor={`story-active-${index}`}>Show this story</Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

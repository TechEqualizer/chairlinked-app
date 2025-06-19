import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, Palette, Layout, Wand2, Star, Quote, User } from 'lucide-react';

interface AdvancedTestimonialsEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedTestimonialsEditor: React.FC<AdvancedTestimonialsEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [testimonialsData, setTestimonialsData] = useState({
    testimonials: sectionData.testimonials || [
      { id: '1', name: '', text: '', rating: 5, image: '', location: '', service: '' }
    ],
    sectionTitle: sectionData.sectionTitle || 'What Our Clients Say',
    sectionSubtitle: sectionData.sectionSubtitle || 'Real reviews from real customers',
    testimonialsLayout: sectionData.testimonialsLayout || 'cards',
    showRatings: sectionData.showRatings !== false,
    showImages: sectionData.showImages !== false,
    brandColor: sectionData.brandColor || '#8B5CF6',
    backgroundColor: sectionData.backgroundColor || '#ffffff',
    ...sectionData
  });

  const updateTestimonialsData = (updates: any) => {
    const newData = { ...testimonialsData, ...updates };
    setTestimonialsData(newData);
    onSectionUpdate(newData);
  };

  const updateTestimonial = (testimonialId: string, field: string, value: any) => {
    const updatedTestimonials = testimonialsData.testimonials.map((testimonial: any) =>
      testimonial.id === testimonialId ? { ...testimonial, [field]: value } : testimonial
    );
    updateTestimonialsData({ testimonials: updatedTestimonials });
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      name: '',
      text: '',
      rating: 5,
      image: '',
      location: '',
      service: ''
    };
    updateTestimonialsData({ testimonials: [...testimonialsData.testimonials, newTestimonial] });
  };

  const removeTestimonial = (testimonialId: string) => {
    const updatedTestimonials = testimonialsData.testimonials.filter((testimonial: any) => testimonial.id !== testimonialId);
    updateTestimonialsData({ testimonials: updatedTestimonials });
  };

  const renderContentPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Testimonial Templates</h4>
      
      <div className="space-y-3">
        {[
          {
            name: 'Hair Salon Template',
            testimonials: [
              { name: 'Sarah Johnson', text: 'Amazing haircut! The stylist really understood what I wanted.', service: 'Haircut & Style', location: 'Downtown' },
              { name: 'Maria Garcia', text: 'Love my new color! Professional service and great atmosphere.', service: 'Hair Color', location: 'Midtown' }
            ]
          },
          {
            name: 'Beauty Studio Template',
            testimonials: [
              { name: 'Emily Chen', text: 'The facial was incredible. My skin feels amazing!', service: 'Facial Treatment', location: 'Westside' },
              { name: 'Jessica Williams', text: 'Perfect makeup for my wedding day. Thank you!', service: 'Bridal Makeup', location: 'Uptown' }
            ]
          },
          {
            name: 'Photography Template',
            testimonials: [
              { name: 'Michael Brown', text: 'Outstanding family photos. Captured perfect moments!', service: 'Family Session', location: 'Studio' },
              { name: 'Lisa Davis', text: 'Professional headshots that landed me the job!', service: 'Headshots', location: 'Corporate' }
            ]
          }
        ].map((template) => (
          <button
            key={template.name}
            onClick={() => {
              const newTestimonials = template.testimonials.map((testimonial, index) => ({
                id: Date.now() + index,
                ...testimonial,
                rating: 5,
                image: `https://images.unsplash.com/photo-${1580000000000 + index * 100000}?w=100&h=100&fit=crop&crop=face`
              }));
              updateTestimonialsData({ testimonials: newTestimonials });
            }}
            className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-600 mt-1">
              {template.testimonials.length} sample testimonials
            </div>
          </button>
        ))}
      </div>

      <div>
        <Label>Rating Generator</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => {
                const updatedTestimonials = testimonialsData.testimonials.map((testimonial: any) => ({
                  ...testimonial,
                  rating
                }));
                updateTestimonialsData({ testimonials: updatedTestimonials });
              }}
              className="p-2 border rounded text-sm hover:bg-gray-50 flex items-center gap-1"
            >
              <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
              {rating}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Testimonial Styling</h4>
      
      <div>
        <Label htmlFor="brandColor">Accent Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="brandColor"
            type="color"
            value={testimonialsData.brandColor}
            onChange={(e) => updateTestimonialsData({ brandColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={testimonialsData.brandColor}
            onChange={(e) => updateTestimonialsData({ brandColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="backgroundColor"
            type="color"
            value={testimonialsData.backgroundColor}
            onChange={(e) => updateTestimonialsData({ backgroundColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={testimonialsData.backgroundColor}
            onChange={(e) => updateTestimonialsData({ backgroundColor: e.target.value })}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Background Presets</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { name: 'White', color: '#ffffff' },
            { name: 'Light Gray', color: '#f9fafb' },
            { name: 'Purple', color: '#faf5ff' },
            { name: 'Blue', color: '#eff6ff' },
            { name: 'Green', color: '#f0fdf4' },
            { name: 'Yellow', color: '#fefce8' }
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateTestimonialsData({ backgroundColor: preset.color })}
              className="p-2 text-xs border rounded-md hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Layout Options</h4>
      
      <div>
        <Label>Testimonials Layout</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Cards', value: 'cards' },
            { name: 'Quotes', value: 'quotes' },
            { name: 'Carousel', value: 'carousel' },
            { name: 'Masonry', value: 'masonry' }
          ].map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateTestimonialsData({ testimonialsLayout: layout.value })}
              className={`p-2 border rounded text-sm ${
                testimonialsData.testimonialsLayout === layout.value
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
        <Label>Display Options</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={testimonialsData.showRatings}
              onChange={(e) => updateTestimonialsData({ showRatings: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show star ratings</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={testimonialsData.showImages}
              onChange={(e) => updateTestimonialsData({ showImages: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show customer photos</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonials Section</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              value={testimonialsData.sectionTitle}
              onChange={(e) => updateTestimonialsData({ sectionTitle: e.target.value })}
              placeholder="What Our Clients Say"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
            <Textarea
              id="sectionSubtitle"
              value={testimonialsData.sectionSubtitle}
              onChange={(e) => updateTestimonialsData({ sectionSubtitle: e.target.value })}
              placeholder="Real reviews from real customers"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Customer Testimonials</h4>
          <Button onClick={addTestimonial} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>

        <div className="space-y-4">
          {testimonialsData.testimonials.map((testimonial: any, index: number) => (
            <Card key={testimonial.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Testimonial {index + 1}</h5>
                  {testimonialsData.testimonials.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestimonial(testimonial.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Customer Name</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                      placeholder="Customer name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateTestimonial(testimonial.id, 'rating', star)}
                          className={`w-6 h-6 ${
                            star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-4 h-4" fill="currentColor" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Testimonial Text</Label>
                    <Textarea
                      value={testimonial.text}
                      onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                      placeholder="What did they say about your service?"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Service</Label>
                    <Input
                      value={testimonial.service}
                      onChange={(e) => updateTestimonial(testimonial.id, 'service', e.target.value)}
                      placeholder="Which service did they use?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      value={testimonial.location}
                      onChange={(e) => updateTestimonial(testimonial.id, 'location', e.target.value)}
                      placeholder="e.g., Los Angeles, CA"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Customer Photo</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={testimonial.image}
                        onChange={(e) => updateTestimonial(testimonial.id, 'image', e.target.value)}
                        placeholder="Photo URL"
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
                              const placeholderUrl = `https://images.unsplash.com/photo-${Date.now()}?w=100&h=100&fit=crop&crop=face`;
                              updateTestimonial(testimonial.id, 'image', placeholderUrl);
                            }
                          };
                          input.click();
                        }}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Panel */}
      {activePanel && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {activePanel === 'content' && <Wand2 className="w-4 h-4" />}
              {activePanel === 'brand' && <Palette className="w-4 h-4" />}
              {activePanel === 'layout' && <Layout className="w-4 h-4" />}
              <span className="capitalize">{activePanel} Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePanel === 'content' && renderContentPanel()}
            {activePanel === 'brand' && renderBrandPanel()}
            {activePanel === 'layout' && renderLayoutPanel()}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card style={{ backgroundColor: testimonialsData.backgroundColor }}>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {testimonialsData.sectionTitle}
            </h2>
            <p className="text-gray-600">
              {testimonialsData.sectionSubtitle}
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {testimonialsData.testimonials.slice(0, 2).map((testimonial: any) => (
              <div 
                key={testimonial.id}
                className="bg-white p-4 rounded-lg border shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {testimonialsData.showImages && testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Quote className="w-4 h-4 text-gray-400" />
                      {testimonialsData.showRatings && (
                        <div className="flex">
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      {testimonial.text || 'Customer testimonial text'}
                    </p>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {testimonial.name || 'Customer Name'}
                      </div>
                      {testimonial.service && (
                        <div className="text-gray-600">{testimonial.service}</div>
                      )}
                      {testimonial.location && (
                        <div className="text-gray-500">{testimonial.location}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Testimonials Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Include specific details about services used</li>
              <li>• Use real customer photos when possible</li>
              <li>• Mix different rating levels for authenticity</li>
              <li>• Keep testimonials concise but impactful</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
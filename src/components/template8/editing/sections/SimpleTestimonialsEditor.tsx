import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Star, Upload, Image as ImageIcon } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating?: number;
  image?: string;
}

interface SimpleTestimonialsEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
}

export const SimpleTestimonialsEditor: React.FC<SimpleTestimonialsEditorProps> = ({
  sectionData,
  onSectionUpdate
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    sectionData.testimonials || [
      { id: '1', name: '', text: '', rating: 5 }
    ]
  );

  const updateTestimonials = (updatedTestimonials: Testimonial[]) => {
    setTestimonials(updatedTestimonials);
    onSectionUpdate({ testimonials: updatedTestimonials });
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      text: '',
      rating: 5
    };
    updateTestimonials([...testimonials, newTestimonial]);
  };

  const removeTestimonial = (testimonialId: string) => {
    if (testimonials.length > 1) {
      updateTestimonials(testimonials.filter(t => t.id !== testimonialId));
    }
  };

  const updateTestimonial = (testimonialId: string, field: keyof Testimonial, value: string | number) => {
    updateTestimonials(
      testimonials.map(testimonial => 
        testimonial.id === testimonialId 
          ? { ...testimonial, [field]: value }
          : testimonial
      )
    );
  };

  const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${onRatingChange ? 'cursor-pointer' : ''}`}
            onClick={() => onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What do your customers say?
        </h3>
        <p className="text-gray-600">
          Add customer testimonials to build trust and show the quality of your work.
        </p>
      </div>

      <div className="grid gap-4">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Testimonial {index + 1}</CardTitle>
                {testimonials.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTestimonial(testimonial.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`testimonial-name-${testimonial.id}`}>Customer Name *</Label>
                  <Input
                    id={`testimonial-name-${testimonial.id}`}
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                    placeholder="e.g., Sarah M."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`testimonial-rating-${testimonial.id}`}>Rating</Label>
                  <div className="mt-2">
                    {renderStars(
                      testimonial.rating || 5, 
                      (rating) => updateTestimonial(testimonial.id, 'rating', rating)
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`testimonial-text-${testimonial.id}`}>Review Text *</Label>
                <Textarea
                  id={`testimonial-text-${testimonial.id}`}
                  value={testimonial.text}
                  onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                  placeholder="What did the customer say about your service?"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Customer Photo (optional)</Label>
                <div className="mt-2 space-y-3">
                  {/* File Upload */}
                  <div className="flex items-center gap-3">
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
                            // For MVP, we'll use a placeholder URL since we don't have file upload backend
                            const placeholderUrl = `https://images.unsplash.com/photo-${Date.now()}?w=100&h=100&fit=crop&crop=face`;
                            updateTestimonial(testimonial.id, 'image', placeholderUrl);
                          }
                        };
                        input.click();
                      }}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </Button>
                    <span className="text-sm text-gray-500">or enter URL below</span>
                  </div>
                  
                  {/* URL Input */}
                  <Input
                    value={testimonial.image || ''}
                    onChange={(e) => updateTestimonial(testimonial.id, 'image', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                  
                  {/* Preview */}
                  {testimonial.image && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {testimonial.image}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateTestimonial(testimonial.id, 'image', '')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addTestimonial}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Testimonial
        </Button>
      </div>

      {/* Preview */}
      {testimonials.some(t => t.name && t.text) && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Testimonials Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {testimonials
                .filter(t => t.name && t.text)
                .slice(0, 2)
                .map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    {testimonial.image && (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        {renderStars(testimonial.rating || 5)}
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.text}"</p>
                    </div>
                  </div>
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
            <h4 className="font-medium text-blue-900">Testimonial Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Use real customer names (with permission)</li>
              <li>• Include specific details about your service</li>
              <li>• Mix different types of customers and services</li>
              <li>• Photos make testimonials more credible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
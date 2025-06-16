
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X, Star } from 'lucide-react';
import { SimpleEditorData, Testimonial } from '@/hooks/useSimpleCustomerEditor';

interface TestimonialsSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: any) => void;
}

export const TestimonialsSectionEditor: React.FC<TestimonialsSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  const testimonials = data.testimonials || [];

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: 'Happy Customer',
      text: 'Great service and amazing results!',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b789',
      location: '',
      service: ''
    };
    onUpdateField('testimonials', [...testimonials, newTestimonial]);
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    onUpdateField('testimonials', updatedTestimonials);
  };

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    onUpdateField('testimonials', updatedTestimonials);
  };

  const setRating = (index: number, rating: number) => {
    updateTestimonial(index, 'rating', rating);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            💬 Testimonials Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Add customer reviews and testimonials
            </p>
            <Button onClick={addTestimonial} size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Add Testimonial
            </Button>
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Star size={48} className="mx-auto mb-2 opacity-50" />
              <p>No testimonials added yet. Click "Add Testimonial" to get started.</p>
            </div>
          )}

          <div className="grid gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Testimonial {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTestimonial(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`testimonial-name-${index}`}>Customer Name</Label>
                    <Input
                      id={`testimonial-name-${index}`}
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`testimonial-location-${index}`}>Location (Optional)</Label>
                    <Input
                      id={`testimonial-location-${index}`}
                      value={testimonial.location || ''}
                      onChange={(e) => updateTestimonial(index, 'location', e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`testimonial-service-${index}`}>Service (Optional)</Label>
                  <Input
                    id={`testimonial-service-${index}`}
                    value={testimonial.service || ''}
                    onChange={(e) => updateTestimonial(index, 'service', e.target.value)}
                    placeholder="Service provided"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`testimonial-text-${index}`}>Review Text</Label>
                  <Textarea
                    id={`testimonial-text-${index}`}
                    value={testimonial.text}
                    onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                    placeholder="What did the customer say about your service?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(index, star)}
                        className="p-1"
                      >
                        <Star
                          size={20}
                          className={`${
                            star <= testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          } cursor-pointer hover:text-yellow-400`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`testimonial-avatar-${index}`}>Avatar URL (Optional)</Label>
                  <Input
                    id={`testimonial-avatar-${index}`}
                    value={testimonial.avatarUrl || ''}
                    onChange={(e) => updateTestimonial(index, 'avatarUrl', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
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

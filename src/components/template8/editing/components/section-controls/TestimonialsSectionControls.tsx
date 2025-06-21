import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  User, 
  Star,
  Plus,
  Trash2,
  Quote,
  ThumbsUp
} from 'lucide-react';

interface TestimonialsSectionControlsProps {
  selectedElement: any;
  sectionData: any;
  onElementPropertyChange: (property: string, value: any) => void;
  onDataUpdate: (updates: any) => void;
}

const TestimonialsSectionControls: React.FC<TestimonialsSectionControlsProps> = ({
  selectedElement,
  sectionData,
  onElementPropertyChange,
  onDataUpdate
}) => {
  const { elementRole } = selectedElement;
  const testimonials = sectionData.testimonials || [];

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      content: 'Amazing service! I highly recommend this professional.',
      author: 'Happy Customer',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      service: 'Hair Styling'
    };
    
    onDataUpdate({
      testimonials: [...testimonials, newTestimonial]
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_: any, i: number) => i !== index);
    onDataUpdate({ testimonials: updatedTestimonials });
  };

  const handleTestimonialUpdate = (index: number, field: string, value: any) => {
    const updatedTestimonials = testimonials.map((testimonial: any, i: number) => 
      i === index ? { ...testimonial, [field]: value } : testimonial
    );
    onDataUpdate({ testimonials: updatedTestimonials });
  };

  const findTestimonialIndex = () => {
    // Try to find which testimonial this element belongs to
    const testimonialContainer = selectedElement.element.closest('[class*="testimonial"]');
    if (testimonialContainer) {
      const allTestimonials = document.querySelectorAll('[class*="testimonial"]');
      return Array.from(allTestimonials).indexOf(testimonialContainer);
    }
    return -1;
  };

  const renderRoleSpecificControls = () => {
    const testimonialIndex = findTestimonialIndex();
    const currentTestimonial = testimonialIndex >= 0 ? testimonials[testimonialIndex] : null;

    switch (elementRole) {
      case 'testimonial-text':
        return (
          <div className="space-y-4">
            {currentTestimonial && (
              <>
                <div>
                  <Label className="text-xs text-gray-400">Testimonial Text</Label>
                  <Textarea
                    value={currentTestimonial.content || selectedElement.properties?.textContent || ''}
                    onChange={(e) => {
                      if (testimonialIndex >= 0) {
                        handleTestimonialUpdate(testimonialIndex, 'content', e.target.value);
                      }
                      onElementPropertyChange('textContent', e.target.value);
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white resize-none"
                    rows={4}
                    placeholder="Enter customer testimonial..."
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-400">Service</Label>
                  <Input
                    value={currentTestimonial.service || ''}
                    onChange={(e) => handleTestimonialUpdate(testimonialIndex, 'service', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white text-xs"
                    placeholder="e.g., Hair Styling, Photography..."
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Text Style</Label>
                  <Select
                    value={selectedElement.properties?.fontSize?.replace('px', '') || '16'}
                    onValueChange={(value) => onElementPropertyChange('fontSize', `${value}px`)}
                  >
                    <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="14" className="text-white hover:bg-gray-600">Small (14px)</SelectItem>
                      <SelectItem value="16" className="text-white hover:bg-gray-600">Regular (16px)</SelectItem>
                      <SelectItem value="18" className="text-white hover:bg-gray-600">Medium (18px)</SelectItem>
                      <SelectItem value="20" className="text-white hover:bg-gray-600">Large (20px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        );

      case 'author':
        return (
          <div className="space-y-4">
            {currentTestimonial && (
              <>
                <div>
                  <Label className="text-xs text-gray-400">Customer Name</Label>
                  <Input
                    value={currentTestimonial.author || selectedElement.properties?.textContent || ''}
                    onChange={(e) => {
                      if (testimonialIndex >= 0) {
                        handleTestimonialUpdate(testimonialIndex, 'author', e.target.value);
                      }
                      onElementPropertyChange('textContent', e.target.value);
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="Customer name..."
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-400">Date</Label>
                  <Input
                    type="date"
                    value={currentTestimonial.date || ''}
                    onChange={(e) => handleTestimonialUpdate(testimonialIndex, 'date', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Name Style</Label>
                  <Select
                    value={selectedElement.properties?.fontWeight || '500'}
                    onValueChange={(value) => onElementPropertyChange('fontWeight', value)}
                  >
                    <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="400" className="text-white hover:bg-gray-600">Regular</SelectItem>
                      <SelectItem value="500" className="text-white hover:bg-gray-600">Medium</SelectItem>
                      <SelectItem value="600" className="text-white hover:bg-gray-600">Semibold</SelectItem>
                      <SelectItem value="700" className="text-white hover:bg-gray-600">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            {currentTestimonial && (
              <>
                <div>
                  <Label className="text-xs text-gray-400">Rating</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            handleTestimonialUpdate(testimonialIndex, 'rating', star);
                            // Update the visual stars in the DOM
                            const stars = selectedElement.element.parentElement?.querySelectorAll('[class*="star"]');
                            if (stars) {
                              stars.forEach((starEl: Element, i: number) => {
                                (starEl as HTMLElement).style.color = i < star ? '#F59E0B' : '#D1D5DB';
                              });
                            }
                          }}
                          className={`w-5 h-5 ${star <= (currentTestimonial.rating || 5) ? 'text-yellow-500' : 'text-gray-400'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({currentTestimonial.rating || 5}/5)
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Star Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value="#F59E0B"
                      onChange={(e) => {
                        // Apply color to all stars in this testimonial
                        const stars = selectedElement.element.closest('[class*="testimonial"]')?.querySelectorAll('[class*="star"]');
                        if (stars) {
                          stars.forEach((star: Element) => {
                            (star as HTMLElement).style.color = e.target.value;
                          });
                        }
                      }}
                      className="w-12 h-8 p-1 rounded border-gray-600"
                    />
                    <span className="text-xs text-gray-400">Star color</span>
                  </div>
                </div>
              </>
            )}
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
                placeholder="Enter testimonials section title..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-400 text-sm">
            Testimonial element selected
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Testimonials Section
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

      {/* Testimonials Management */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
          <User className="w-3 h-3" />
          Testimonials Management
        </h5>
        
        <div className="space-y-3">
          <div className="text-xs text-gray-400">
            Total Testimonials: {testimonials.length}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddTestimonial}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-2" />
            Add New Testimonial
          </Button>
          
          {testimonials.length > 0 && (
            <div className="space-y-2">
              {testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-gray-700 p-3 rounded text-xs">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-white font-medium">{testimonial.author}</div>
                      <div className="text-gray-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        {testimonial.rating}/5
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveTestimonial(index)}
                      className="text-red-400 hover:text-red-300 p-1 h-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-gray-300 text-xs line-clamp-2">
                    {testimonial.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3">
          Display Settings
        </h5>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400">Layout Style</Label>
            <Select
              value={sectionData.testimonialsLayout || 'cards'}
              onValueChange={(value) => onDataUpdate({ testimonialsLayout: value })}
            >
              <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="cards" className="text-white hover:bg-gray-600">Cards</SelectItem>
                <SelectItem value="slider" className="text-white hover:bg-gray-600">Slider</SelectItem>
                <SelectItem value="list" className="text-white hover:bg-gray-600">List</SelectItem>
                <SelectItem value="grid" className="text-white hover:bg-gray-600">Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-400">Testimonials Per Row</Label>
            <Select
              value={sectionData.testimonialsPerRow?.toString() || '2'}
              onValueChange={(value) => onDataUpdate({ testimonialsPerRow: parseInt(value) })}
            >
              <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="1" className="text-white hover:bg-gray-600">1 column</SelectItem>
                <SelectItem value="2" className="text-white hover:bg-gray-600">2 columns</SelectItem>
                <SelectItem value="3" className="text-white hover:bg-gray-600">3 columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-ratings"
                checked={sectionData.showRatings !== false}
                onChange={(e) => onDataUpdate({ showRatings: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show-ratings" className="text-xs text-gray-400">
                Show star ratings
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-dates"
                checked={sectionData.showDates !== false}
                onChange={(e) => onDataUpdate({ showDates: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show-dates" className="text-xs text-gray-400">
                Show review dates
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-services"
                checked={sectionData.showServices !== false}
                onChange={(e) => onDataUpdate({ showServices: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show-services" className="text-xs text-gray-400">
                Show service types
              </Label>
            </div>
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
              // Add quote icons to all testimonials
              const testimonialTexts = document.querySelectorAll('[data-section="testimonials"] [class*="testimonial-text"]');
              testimonialTexts.forEach(text => {
                if (!text.querySelector('.quote-icon')) {
                  const quote = document.createElement('span');
                  quote.className = 'quote-icon';
                  quote.innerHTML = '"';
                  quote.style.fontSize = '2rem';
                  quote.style.color = sectionData.brandColor || '#3B82F6';
                  text.prepend(quote);
                }
              });
            }}
            className="w-full text-xs"
          >
            <Quote className="w-3 h-3 mr-2" />
            Add Quote Icons
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Sort testimonials by rating (highest first)
              const sortedTestimonials = [...testimonials].sort((a, b) => (b.rating || 0) - (a.rating || 0));
              onDataUpdate({ testimonials: sortedTestimonials });
            }}
            className="w-full text-xs"
          >
            <ThumbsUp className="w-3 h-3 mr-2" />
            Sort by Rating
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Apply brand color to all star ratings
              const stars = document.querySelectorAll('[data-section="testimonials"] [class*="star"]');
              stars.forEach(star => {
                (star as HTMLElement).style.color = sectionData.brandColor || '#F59E0B';
              });
            }}
            className="w-full text-xs"
          >
            <Star className="w-3 h-3 mr-2" />
            Apply Brand Color to Stars
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSectionControls;
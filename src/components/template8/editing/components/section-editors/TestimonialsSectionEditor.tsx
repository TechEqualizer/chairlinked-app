import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, Plus, Trash2, User } from "lucide-react";

interface TestimonialsSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const TestimonialsSectionEditor: React.FC<TestimonialsSectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'settings'>('testimonials');

  const handleTestimonialUpdate = (index: number, field: string, value: any) => {
    const updatedTestimonials = [...(pageData.testimonials || [])];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    onUpdate({ testimonials: updatedTestimonials });
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: '',
      role: '',
      avatar: '',
      content: '',
      rating: 5,
      featured: false
    };
    const updatedTestimonials = [...(pageData.testimonials || []), newTestimonial];
    onUpdate({ testimonials: updatedTestimonials });
  };

  const handleRemoveTestimonial = (index: number) => {
    const updatedTestimonials = [...(pageData.testimonials || [])];
    updatedTestimonials.splice(index, 1);
    onUpdate({ testimonials: updatedTestimonials });
  };

  const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange?.(star)}
            className={`
              ${onRatingChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              transition-transform
            `}
          >
            <Star
              className={`w-4 h-4 ${
                star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: User }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all flex-1
                ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Customer Testimonials ({pageData.testimonials?.length || 0})
              </h4>
              <button
                onClick={handleAddTestimonial}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Testimonial
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pageData.testimonials?.map((testimonial: any, index: number) => (
                <div key={testimonial.id || index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={testimonial.name || ''}
                          onChange={(e) => handleTestimonialUpdate(index, 'name', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Customer name"
                        />
                        
                        <input
                          type="text"
                          value={testimonial.role || ''}
                          onChange={(e) => handleTestimonialUpdate(index, 'role', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Role/Company"
                        />
                      </div>
                      
                      <input
                        type="url"
                        value={testimonial.avatar || ''}
                        onChange={(e) => handleTestimonialUpdate(index, 'avatar', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Avatar image URL"
                      />
                      
                      <textarea
                        value={testimonial.content || ''}
                        onChange={(e) => handleTestimonialUpdate(index, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Testimonial content"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Rating:</span>
                          {renderStars(testimonial.rating || 5, (rating) => 
                            handleTestimonialUpdate(index, 'rating', rating)
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={testimonial.featured || false}
                              onChange={(e) => handleTestimonialUpdate(index, 'featured', e.target.checked)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-600">Featured</span>
                          </label>
                          
                          <button
                            onClick={() => handleRemoveTestimonial(index)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pageData.testimonials?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No testimonials yet. Add your first review!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={pageData.testimonialsTitle || 'What Our Clients Say'}
                onChange={(e) => onUpdate({ testimonialsTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={pageData.testimonialsSubtitle || 'Real reviews from real customers'}
                onChange={(e) => onUpdate({ testimonialsSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'carousel', label: 'Carousel' },
                  { value: 'grid', label: 'Grid' },
                  { value: 'list', label: 'List' },
                  { value: 'masonry', label: 'Masonry' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onUpdate({ testimonialsStyle: style.value })}
                    className={`
                      px-3 py-2 rounded-lg border text-sm transition-colors
                      ${(pageData.testimonialsStyle || 'carousel') === style.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showTestimonialRatings !== false}
                  onChange={(e) => onUpdate({ showTestimonialRatings: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Star Ratings</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showTestimonialAvatars !== false}
                  onChange={(e) => onUpdate({ showTestimonialAvatars: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Customer Avatars</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.enableTestimonialAutoplay !== false}
                  onChange={(e) => onUpdate({ enableTestimonialAutoplay: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Autoplay (Carousel)</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.featuredTestimonialsOnly || false}
                  onChange={(e) => onUpdate({ featuredTestimonialsOnly: e.target.checked })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Featured Only</span>
              </label>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSectionEditor;
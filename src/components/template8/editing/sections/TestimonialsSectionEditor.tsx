import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionEditorWrapper from "../components/SectionEditorWrapper";
import EditableTemplate8TestimonialsBlock from "../../editableBlocks/EditableTemplate8TestimonialsBlock";
import TestimonialsVerticalToolbar from "../components/TestimonialsVerticalToolbar";
import { useUniversalEditing } from "../hooks/useUniversalEditing";
import { SectionTheme } from "../../utils/themeUtils";

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
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState<number | undefined>(undefined);

  const {
    isDirty,
    isAutoSaving,
    saveChanges,
    handleUpdate
  } = useUniversalEditing({ pageData, onUpdate, onSave });

  const testimonials = pageData.testimonials || [
    {
      name: "Sarah Chen",
      text: "Working with this team transformed our entire digital presence. The attention to detail and creative vision exceeded all our expectations.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b789",
      location: "San Francisco, CA",
      service: "Brand Strategy"
    },
    {
      name: "Michael Rodriguez",
      text: "Incredible results! Our website traffic increased by 300% within the first month. The design is both beautiful and highly functional.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      location: "Austin, TX", 
      service: "Web Development"
    },
    {
      name: "Emma Thompson",
      text: "Professional, creative, and delivered on time. They understood our vision perfectly and brought it to life in ways we never imagined.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      location: "New York, NY",
      service: "Digital Strategy"
    }
  ];

  const handleThemeChange = (theme: SectionTheme) => {
    console.log('[TestimonialsSectionEditor] Theme changed to:', theme);
    handleUpdate({ testimonialsTheme: theme });
  };

  const handleTitleChange = (title: string) => {
    console.log('[TestimonialsSectionEditor] Title changed to:', title);
    handleUpdate({ testimonialsTitle: title });
  };

  const handleSubtitleChange = (subtitle: string) => {
    console.log('[TestimonialsSectionEditor] Subtitle changed to:', subtitle);
    handleUpdate({ testimonialsSubtitle: subtitle });
  };

  const handleAddTestimonial = () => {
    console.log('[TestimonialsSectionEditor] Adding new testimonial');
    const newTestimonial = {
      name: "New Client",
      text: "Add your testimonial text here...",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b789",
      location: "City, State",
      service: "Service Name"
    };
    const updatedTestimonials = [...testimonials, newTestimonial];
    handleUpdate({ testimonials: updatedTestimonials });
    
    // Auto-select the newly added testimonial
    setSelectedTestimonialIndex(updatedTestimonials.length - 1);
  };

  const handleUpdateTestimonial = (index: number, field: string, value: any) => {
    console.log('[TestimonialsSectionEditor] Updating testimonial:', { index, field, value });
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    handleUpdate({ testimonials: updatedTestimonials });
  };

  const handleDeleteTestimonial = (index: number) => {
    console.log('[TestimonialsSectionEditor] Deleting testimonial at index:', index);
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    handleUpdate({ testimonials: updatedTestimonials });
    
    // Clear selection if the deleted testimonial was selected
    if (selectedTestimonialIndex === index) {
      setSelectedTestimonialIndex(undefined);
    } else if (selectedTestimonialIndex !== undefined && selectedTestimonialIndex > index) {
      // Adjust selection index if a testimonial before the selected one was deleted
      setSelectedTestimonialIndex(selectedTestimonialIndex - 1);
    }
  };

  const handleRatingUpdate = (index: number, rating: number) => {
    console.log('[TestimonialsSectionEditor] Rating updated:', { index, rating });
    handleUpdateTestimonial(index, 'rating', rating);
  };

  const currentTheme = pageData.testimonialsTheme || 'light';
  const currentTitle = pageData.testimonialsTitle || "What Our Clients Say";
  const currentSubtitle = pageData.testimonialsSubtitle || "Don't just take our word for it - hear from the amazing people we've had the pleasure to work with.";

  console.log('[TestimonialsSectionEditor] Current state:', {
    currentTheme,
    testimonialsCount: testimonials.length,
    selectedTestimonialIndex,
    brandColor: pageData.brandColor
  });

  return (
    <SectionEditorWrapper sectionName="Client Testimonials">
      <div 
        className="min-h-screen transition-all duration-500 relative overflow-hidden"
        style={{
          background: currentTheme === 'dark' 
            ? 'linear-gradient(135deg, #1f2937, #111827)' 
            : currentTheme === 'auto'
            ? `linear-gradient(135deg, ${pageData.brandColor || '#8B5CF6'}08, ${pageData.brandColor || '#8B5CF6'}15, ${pageData.brandColor || '#8B5CF6'}08)`
            : 'linear-gradient(135deg, #f9fafb, #f3f4f6, #f9fafb)'
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 right-20 w-64 h-64 border border-opacity-30 rounded-full animate-pulse" 
            style={{ 
              borderColor: pageData.brandColor ? `${pageData.brandColor}30` : '#8B5CF630' 
            }} 
          />
          <div 
            className="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-2xl"
            style={{
              background: pageData.brandColor ? 
                `linear-gradient(45deg, ${pageData.brandColor}10, ${pageData.brandColor}20)` : 
                'linear-gradient(45deg, #8B5CF610, #8B5CF620)'
            }} 
          />
        </div>

        {/* Section Label */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Client Testimonials Section</span>
          </div>
        </div>

        {/* Vertical Toolbar */}
        <TestimonialsVerticalToolbar
          testimonials={testimonials}
          currentTheme={currentTheme}
          title={currentTitle}
          subtitle={currentSubtitle}
          onThemeChange={handleThemeChange}
          onTitleChange={handleTitleChange}
          onSubtitleChange={handleSubtitleChange}
          onAddTestimonial={handleAddTestimonial}
          onUpdateTestimonial={handleUpdateTestimonial}
          onDeleteTestimonial={handleDeleteTestimonial}
          onRatingUpdate={handleRatingUpdate}
          selectedTestimonialIndex={selectedTestimonialIndex}
          onSelectTestimonial={setSelectedTestimonialIndex}
          brandColor={pageData.brandColor || "#8B5CF6"}
        />

        {/* Testimonials Preview */}
        <div className="relative z-10 pt-20">
          <EditableTemplate8TestimonialsBlock 
            pageData={{
              ...pageData,
              testimonials,
              brandColor: pageData.brandColor || "#8B5CF6",
              fontClass: pageData.fontClass || "font-inter",
              businessName: pageData.businessName || "Creative Studio",
              testimonialsTheme: currentTheme,
              testimonialsTitle: currentTitle,
              testimonialsSubtitle: currentSubtitle
            }}
            onUpdate={handleUpdate}
          />
        </div>

        {/* Auto-save indicator */}
        {isAutoSaving && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
              <span className="text-sm text-gray-600">Auto-saving...</span>
            </div>
          </div>
        )}

        {/* Floating Action Hint */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              ⭐ Use the vertical toolbar to customize themes, content, and testimonials. Click any testimonial to edit it.
            </p>
          </div>
        </div>
      </div>
    </SectionEditorWrapper>
  );
};

export default TestimonialsSectionEditor;

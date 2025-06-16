
import React, { useState } from "react";
import { Palette, Type, Users, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TestimonialsThemePanel from "./TestimonialsThemePanel";
import TestimonialsHeaderPanel from "./TestimonialsHeaderPanel";
import TestimonialsManagementPanel from "./TestimonialsManagementPanel";
import TestimonialItemPanel from "./TestimonialItemPanel";
import EnhancedVerticalToolbar from "./toolbar/EnhancedVerticalToolbar";
import { SectionTheme } from "../../utils/themeUtils";

interface TestimonialsVerticalToolbarProps {
  testimonials: any[];
  currentTheme: SectionTheme;
  title: string;
  subtitle: string;
  onThemeChange: (theme: SectionTheme) => void;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  onAddTestimonial: () => void;
  onUpdateTestimonial: (index: number, field: string, value: any) => void;
  onDeleteTestimonial: (index: number) => void;
  onRatingUpdate: (index: number, rating: number) => void;
  selectedTestimonialIndex?: number;
  onSelectTestimonial: (index: number | undefined) => void;
  brandColor?: string;
  
  // Navigation
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  
  // Validation
  hasErrors?: boolean;
}

const TestimonialsVerticalToolbar: React.FC<TestimonialsVerticalToolbarProps> = ({
  testimonials,
  currentTheme,
  title,
  subtitle,
  onThemeChange,
  onTitleChange,
  onSubtitleChange,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
  onRatingUpdate,
  selectedTestimonialIndex,
  onSelectTestimonial,
  brandColor = "#8B5CF6",
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  hasErrors
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const closePanel = () => {
    setActivePanel(null);
    onSelectTestimonial(undefined);
  };

  // Auto-open testimonial panel when a testimonial is selected
  React.useEffect(() => {
    if (selectedTestimonialIndex !== undefined) {
      setActivePanel('testimonial');
    } else if (activePanel === 'testimonial') {
      setActivePanel(null);
    }
  }, [selectedTestimonialIndex]);

  const availablePanels = [
    {
      id: 'theme',
      icon: <Palette size={18} />,
      title: 'Theme Settings'
    },
    {
      id: 'header',
      icon: <Type size={18} />,
      title: 'Section Content'
    },
    {
      id: 'management',
      icon: <Users size={18} />,
      title: 'Testimonials Management'
    },
    ...(selectedTestimonialIndex !== undefined ? [{
      id: 'testimonial',
      icon: <User size={18} />,
      title: 'Edit Selected Testimonial'
    }] : [])
  ];

  return (
    <>
      <EnhancedVerticalToolbar
        brandColor={brandColor}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        availablePanels={availablePanels}
        currentSection="Testimonials"
        onPrevious={onPrevious}
        onNext={onNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        hasErrors={hasErrors}
      />

      {/* Floating Panels */}
      <AnimatePresence>
        {activePanel === 'theme' && (
          <TestimonialsThemePanel
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            onClose={closePanel}
          />
        )}
        
        {activePanel === 'header' && (
          <TestimonialsHeaderPanel
            title={title}
            subtitle={subtitle}
            onTitleChange={onTitleChange}
            onSubtitleChange={onSubtitleChange}
            brandColor={brandColor}
            onClose={closePanel}
          />
        )}

        {activePanel === 'management' && (
          <TestimonialsManagementPanel
            onAddTestimonial={onAddTestimonial}
            testimonialsCount={testimonials.length}
            brandColor={brandColor}
            onClose={closePanel}
          />
        )}

        {activePanel === 'testimonial' && selectedTestimonialIndex !== undefined && (
          <TestimonialItemPanel
            testimonial={testimonials[selectedTestimonialIndex]}
            testimonialIndex={selectedTestimonialIndex}
            onUpdate={(field, value) => onUpdateTestimonial(selectedTestimonialIndex, field, value)}
            onDelete={() => onDeleteTestimonial(selectedTestimonialIndex)}
            onRatingUpdate={(rating) => onRatingUpdate(selectedTestimonialIndex, rating)}
            brandColor={brandColor}
            onClose={closePanel}
          />
        )}
      </AnimatePresence>

      {/* Background overlay when panel is open */}
      {activePanel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/5"
          onClick={closePanel}
        />
      )}
    </>
  );
};

export default TestimonialsVerticalToolbar;


import React from "react";
import { motion } from "framer-motion";
import TestimonialsHeader from "./components/TestimonialsHeader";
import EnhancedTestimonialCard from "./components/EnhancedTestimonialCard";
import { getIndustryThemeClasses } from "../utils/themeUtils";

interface EditableTemplate8TestimonialsBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isProductionPreview?: boolean;
}

const EditableTemplate8TestimonialsBlock: React.FC<EditableTemplate8TestimonialsBlockProps> = ({
  pageData,
  onUpdate,
  isProductionPreview = false
}) => {
  const testimonials = pageData.testimonials || [];
  const testimonialsTheme = pageData.testimonialsTheme || 'light';
  const brandColor = pageData.brandColor || "#8B5CF6";
  const fontClass = pageData.fontClass || "font-inter";
  
  // Get industry-specific theme classes if industry theme is selected
  const industryClasses = testimonialsTheme === 'industry' && pageData.industry ? 
    getIndustryThemeClasses(pageData.industry, 'testimonials', brandColor) : null;

  // In production preview mode, disable updates
  const handleUpdate = isProductionPreview ? () => {} : onUpdate;

  const getThemeClasses = () => {
    if (industryClasses) {
      return {
        background: 'bg-[var(--industry-bg-secondary)]',
        card: 'bg-white/80 border-[var(--industry-border)] shadow-[var(--industry-shadow)]',
        text: 'text-[var(--industry-text-primary)]',
        textSecondary: 'text-[var(--industry-text-secondary)]'
      };
    }

    switch (testimonialsTheme) {
      case 'dark':
        return {
          background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
          card: 'bg-gray-800/80 border-gray-700/50 shadow-2xl shadow-gray-900/20',
          text: 'text-white',
          textSecondary: 'text-gray-300'
        };
      case 'auto':
        return {
          background: `bg-gradient-to-br from-gray-50 via-white to-gray-50`,
          card: 'bg-white/80 border-gray-200/50 shadow-lg',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600'
        };
      default: // light
        return {
          background: `bg-gradient-to-br from-gray-50 via-white to-gray-50`,
          card: 'bg-white/80 border-gray-200/50 shadow-lg',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const title = pageData.testimonialsHeadline || pageData.testimonialsTitle || "What Our Clients Say";
  const subtitle = pageData.testimonialsSubheadline || pageData.testimonialsSubtitle || "Real stories from real clients who love our work";

  const handleTitleChange = (newTitle: string) => {
    handleUpdate({ 
      testimonialsHeadline: newTitle,
      testimonialsTitle: newTitle 
    });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    handleUpdate({ 
      testimonialsSubheadline: newSubtitle,
      testimonialsSubtitle: newSubtitle 
    });
  };

  return (
    <div className={isProductionPreview ? "testimonials-production-preview-mode" : ""}>
      {isProductionPreview && (
        <style>{`
          .testimonials-production-preview-mode .editable-element,
          .testimonials-production-preview-mode [contentEditable] {
            pointer-events: none !important;
            cursor: default !important;
          }
        `}</style>
      )}
      
      <section 
        id="testimonials" 
        className={`relative py-20 lg:py-24 transition-all duration-500 overflow-hidden ${themeClasses.background} ${
          industryClasses ? 'industry-theme-wrapper' : ''
        }`}
        style={industryClasses ? {
          fontFamily: `var(--industry-font-secondary)`,
          padding: `var(--industry-section-padding) 0`,
        } : undefined}
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-20 right-20 w-80 h-80 border border-gray-200/10 rounded-full"
            style={{ borderColor: `${brandColor}08` }}
          />
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 left-32 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${brandColor}08 0%, ${brandColor}04 50%, transparent 100%)`
            }}
          />
          <motion.div
            animate={{ 
              x: [0, 50, 0],
              y: [0, -20, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-2xl"
            style={{
              background: `linear-gradient(135deg, ${brandColor}06, ${brandColor}12, transparent)`
            }}
          />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Enhanced Header */}
          <TestimonialsHeader
            title={title}
            subtitle={subtitle}
            brandColor={brandColor}
            fontClass={fontClass}
            themeClasses={themeClasses}
            onTitleChange={handleTitleChange}
            onSubtitleChange={handleSubtitleChange}
            isEditMode={!isProductionPreview}
          />

          {/* Enhanced Testimonials Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {testimonials.slice(0, 6).map((testimonial: any, index: number) => (
              <EnhancedTestimonialCard
                key={index}
                testimonial={{
                  ...testimonial,
                  text: testimonial.text || testimonial.content || 'Amazing service and results!',
                  name: testimonial.name || 'Happy Client',
                  rating: testimonial.rating || 5,
                  location: testimonial.location || 'Verified Client'
                }}
                index={index}
                brandColor={brandColor}
                fontClass={fontClass}
                themeClasses={themeClasses}
              />
            ))}
          </motion.div>

          {/* Call to action hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div 
              className="inline-flex items-center gap-3 backdrop-blur-xl rounded-2xl px-8 py-4 border-2"
              style={{
                borderColor: `${brandColor}20`,
                background: `linear-gradient(135deg, ${brandColor}05, ${brandColor}10, ${brandColor}05)`
              }}
            >
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: brandColor }}
              />
              <span 
                className={`text-sm font-medium ${fontClass}`}
                style={{ color: brandColor }}
              >
                Join our happy clients today
              </span>
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: brandColor, animationDelay: '0.5s' }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EditableTemplate8TestimonialsBlock;

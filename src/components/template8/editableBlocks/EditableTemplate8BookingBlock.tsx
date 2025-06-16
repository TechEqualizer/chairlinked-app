
import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import { getThemeClasses, getIndustryThemeClasses } from "@/components/template8/utils/themeUtils";
import { IndustryDesignSystem } from "@/components/template8/design-system/services/IndustryDesignSystem";

interface EditableTemplate8BookingBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isProductionPreview?: boolean;
}

const EditableTemplate8BookingBlock: React.FC<EditableTemplate8BookingBlockProps> = ({
  pageData,
  onUpdate,
  isProductionPreview = false
}) => {
  // In production preview mode, disable updates
  const handleUpdate = isProductionPreview ? () => {} : onUpdate;

  const handleBookingClick = () => {
    if (pageData.bookingLink?.trim()) {
      window.open(pageData.bookingLink.trim(), '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No booking link provided');
    }
  };

  // Get theme-aware styling
  const bookingTheme = pageData.bookingTheme || 'light';
  const industry = pageData.industry;
  const brandColor = pageData.brandColor || '#8B5CF6';

  // Get theme classes
  const themeClasses = bookingTheme === 'industry' && industry
    ? getIndustryThemeClasses(industry, 'testimonials', brandColor)
    : getThemeClasses(bookingTheme, brandColor, industry, 'testimonials');

  // Generate industry CSS if needed
  const industryCSS = bookingTheme === 'industry' && industry
    ? IndustryDesignSystem.generateIndustryCSS(industry, brandColor)
    : '';

  return (
    <div className={isProductionPreview ? "booking-production-preview-mode" : ""}>
      {/* Industry Theme CSS */}
      {industryCSS && (
        <style dangerouslySetInnerHTML={{ __html: industryCSS }} />
      )}
      
      {isProductionPreview && (
        <style>{`
          .booking-production-preview-mode .editable-element,
          .booking-production-preview-mode [contentEditable] {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          .booking-production-preview-mode button {
            cursor: default !important;
          }
          
          .booking-production-preview-mode .edit-pencil,
          .booking-production-preview-mode .edit-overlay,
          .booking-production-preview-mode .edit-tooltip {
            display: none !important;
          }
        `}</style>
      )}
      
      <section 
        id="booking" 
        className={`relative py-24 lg:py-32 overflow-hidden ${themeClasses.background}`}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: brandColor }}
          />
          <div 
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: brandColor }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Content Card with Glassmorphism Effect */}
          <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 lg:p-16 shadow-2xl">
            
            {/* Premium Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" style={{ color: brandColor }} />
                <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                  Ready to Book
                </span>
              </div>
            </div>

            {/* Headlines Section */}
            <div className="text-center space-y-6 mb-12">
              {/* Main Headline */}
              <SimpleEditableText
                value={pageData.bookingHeadline || `Book Your Session at ${pageData.businessName || 'Creative Studio'}`}
                onChange={(value) => handleUpdate({ bookingHeadline: value })}
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${themeClasses.text} leading-tight tracking-tight`}
                placeholder="Your booking headline..."
                disabled={isProductionPreview}
              />

              {/* Subheadline */}
              <SimpleEditableText
                value={pageData.bookingSubheadline || "Ready to transform your look? Schedule your appointment and let's bring your vision to life."}
                onChange={(value) => handleUpdate({ bookingSubheadline: value })}
                className={`text-xl sm:text-2xl ${themeClasses.textSecondary} max-w-3xl mx-auto leading-relaxed font-light`}
                placeholder="Your booking description..."
                disabled={isProductionPreview}
              />
            </div>

            {/* CTA Button Section */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Button Glow Effect */}
                <div 
                  className="absolute -inset-0.5 rounded-2xl opacity-30 group-hover:opacity-50 blur transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(45deg, ${brandColor}, ${brandColor}80, ${brandColor})` 
                  }}
                />
                
                {/* Main CTA Button */}
                <button
                  onClick={handleBookingClick}
                  className="relative px-12 py-5 rounded-2xl text-white font-semibold text-lg lg:text-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl transform flex items-center gap-4 group overflow-hidden min-w-[240px] justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
                    boxShadow: `0 20px 40px ${brandColor}40`
                  }}
                  disabled={isProductionPreview}
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Button Content */}
                  <SimpleEditableText
                    value={pageData.ctaText || "Book Now"}
                    onChange={(value) => handleUpdate({ ctaText: value })}
                    placeholder="Button text..."
                    tag="span"
                    disabled={isProductionPreview}
                    className="relative z-10"
                  />
                  
                  {/* Button Icon */}
                  <ExternalLink 
                    size={24} 
                    className="relative z-10 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300"
                  />
                </button>
              </div>
            </div>

            {/* Optional booking link indicator */}
            {pageData.bookingLink && (
              <div className="text-center mt-6">
                <p className={`text-sm ${themeClasses.textSecondary} opacity-70`}>
                  Opens securely in a new window
                </p>
              </div>
            )}
          </div>

          {/* Bottom Decorative Line */}
          <div className="flex justify-center mt-12">
            <div 
              className="w-24 h-1 rounded-full opacity-50"
              style={{ backgroundColor: brandColor }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableTemplate8BookingBlock;

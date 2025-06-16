
import React from "react";
import { Instagram, Phone, Mail } from "lucide-react";
import { getIndustryThemeClasses } from "../utils/themeUtils";
import ChairlinkedBadge from "@/components/common/ChairlinkedBadge";

interface EditableTemplate8FooterBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isProductionPreview?: boolean;
  siteType?: string; // New prop to determine if this is a demo or live site
}

const EditableTemplate8FooterBlock: React.FC<EditableTemplate8FooterBlockProps> = ({
  pageData,
  onUpdate,
  isProductionPreview = false,
  siteType = 'demo' // Default to demo for backward compatibility
}) => {
  const footerTheme = pageData.footerTheme || 'dark';
  
  // Get industry-specific theme classes if industry theme is selected
  const industryClasses = footerTheme === 'industry' && pageData.industry ? 
    getIndustryThemeClasses(pageData.industry, 'footer', pageData.brandColor) : null;

  const getThemeClasses = () => {
    if (industryClasses) {
      return {
        background: 'bg-[var(--industry-text-primary)]',
        text: 'text-[var(--industry-bg-primary)]',
        textSecondary: 'text-[var(--industry-bg-secondary)]'
      };
    }

    switch (footerTheme) {
      case 'light':
        return {
          background: 'bg-gray-100',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600'
        };
      default: // dark
        return {
          background: 'bg-gray-900',
          text: 'text-white',
          textSecondary: 'text-gray-300'
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Only show badge for demo sites, not live sites
  const shouldShowBadge = siteType === 'demo';

  return (
    <div className={isProductionPreview ? "footer-production-preview-mode" : ""}>
      {isProductionPreview && (
        <style>{`
          .footer-production-preview-mode .editable-element,
          .footer-production-preview-mode [contentEditable] {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          .footer-production-preview-mode a {
            cursor: default !important;
          }
        `}</style>
      )}
      <footer 
        className={`${themeClasses.background} ${themeClasses.text} py-12 ${
          industryClasses ? 'industry-theme-wrapper' : ''
        }`}
        style={industryClasses ? {
          fontFamily: `var(--industry-font-secondary)`,
          padding: `calc(var(--industry-section-padding) * 0.6) 0`,
        } : undefined}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business Info */}
            <div>
              <h3 
                className={`text-xl font-bold mb-4 ${themeClasses.text}`}
                style={industryClasses ? {
                  fontFamily: `var(--industry-font-primary)`,
                  fontWeight: `var(--industry-heading-weight)`,
                } : undefined}
              >
                {pageData.businessName || "Creative Studio"}
              </h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                {pageData.description || "Creating amazing experiences with professional quality and personal touch."}
              </p>
              <div className="flex space-x-4">
                <Instagram size={20} className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`} />
                <Phone size={20} className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`} />
                <Mail size={20} className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`} />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 
                className={`text-lg font-semibold mb-4 ${themeClasses.text}`}
                style={industryClasses ? {
                  fontFamily: `var(--industry-font-primary)`,
                } : undefined}
              >
                Quick Links
              </h4>
              <ul className={`space-y-2 ${themeClasses.textSecondary}`}>
                <li><a href="#gallery" className={`hover:${themeClasses.text} transition-colors`}>Gallery</a></li>
                <li><a href="#testimonials" className={`hover:${themeClasses.text} transition-colors`}>Testimonials</a></li>
                <li><a href="#booking" className={`hover:${themeClasses.text} transition-colors`}>Book Now</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 
                className={`text-lg font-semibold mb-4 ${themeClasses.text}`}
                style={industryClasses ? {
                  fontFamily: `var(--industry-font-primary)`,
                } : undefined}
              >
                Contact
              </h4>
              <div className={`space-y-2 ${themeClasses.textSecondary}`}>
                <p>{pageData.phoneNumber || "(555) 123-4567"}</p>
                <p>{pageData.contactEmail || "hello@creativestudio.com"}</p>
                <p>Open Daily 9AM - 7PM</p>
              </div>
            </div>
          </div>

          <div className={`border-t ${footerTheme === 'light' ? 'border-gray-300' : 'border-gray-700'} mt-8 pt-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className={`text-center sm:text-left ${themeClasses.textSecondary}`}>
                &copy; 2024 {pageData.businessName || "Creative Studio"}. All rights reserved.
              </p>
              
              {/* Inline Chairlinked Badge in Footer - only show for demo sites */}
              {shouldShowBadge && (
                <div className="flex items-center">
                  <ChairlinkedBadge 
                    variant="inline" 
                    theme={footerTheme === 'light' ? 'light' : 'dark'} 
                    className={themeClasses.textSecondary}
                    showBadge={shouldShowBadge}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EditableTemplate8FooterBlock;

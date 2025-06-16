
import React from "react";
import InstagramNavbar from "@/components/template3/InstagramNavbar";

interface EditableTemplate8NavbarBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  fixed?: boolean;
  forceMobile?: boolean;
  isProductionPreview?: boolean;
}

const EditableTemplate8NavbarBlock: React.FC<EditableTemplate8NavbarBlockProps> = ({
  pageData,
  onUpdate,
  fixed = true,
  forceMobile = false,
  isProductionPreview = false
}) => {
  return (
    <div className={forceMobile ? "force-mobile-navbar" : ""}>
      {forceMobile && (
        <style>{`
          /* Hide desktop navigation */
          .force-mobile-navbar nav.hidden.md\\:flex {
            display: none !important;
          }
          
          /* Show mobile menu button */
          .force-mobile-navbar button.md\\:hidden {
            display: flex !important;
          }
          
          /* Hide desktop CTA button container */
          .force-mobile-navbar div.hidden.md\\:flex {
            display: none !important;
          }
          
          /* More specific targeting for nav elements */
          .force-mobile-navbar .container nav {
            display: none !important;
          }
          
          /* Show hamburger menu button specifically */
          .force-mobile-navbar .container > button:last-child,
          .force-mobile-navbar .container button[aria-label="Menu"] {
            display: flex !important;
          }
          
          /* Ensure proper mobile layout */
          .force-mobile-navbar .container {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          
          /* Hide any desktop-only elements */
          .force-mobile-navbar .md\\:flex:not(button) {
            display: none !important;
          }
          
          /* Show mobile-only elements */
          .force-mobile-navbar .md\\:hidden {
            display: flex !important;
          }
        `}</style>
      )}
      {isProductionPreview && (
        <style>{`
          /* Disable all editing interactions in production preview mode */
          [data-production-preview="true"] .editable-element,
          [data-production-preview="true"] [contentEditable],
          [data-production-preview="true"] .edit-button,
          [data-production-preview="true"] .hover-edit {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          /* Hide edit indicators */
          [data-production-preview="true"] .edit-pencil,
          [data-production-preview="true"] .edit-overlay,
          [data-production-preview="true"] .edit-tooltip {
            display: none !important;
          }
        `}</style>
      )}
      <div data-production-preview={isProductionPreview}>
        <InstagramNavbar
          businessName={pageData.businessName || "Creative Studio"}
          brandColor={pageData.brandColor || "#8B5CF6"}
          navbarBackgroundColor={pageData.navbarBackgroundColor || "#FFFFFF"}
          logoUrl={pageData.logoUrl}
          fontClass={pageData.fontClass || "font-inter"}
          ctaText={pageData.ctaText || "Get Started"}
          fixed={fixed}
        />
      </div>
    </div>
  );
};

export default EditableTemplate8NavbarBlock;

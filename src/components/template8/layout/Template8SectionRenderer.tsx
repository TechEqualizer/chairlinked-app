
import React from "react";
import EditableTemplate8NavbarBlock from "../editableBlocks/EditableTemplate8NavbarBlock";
import EditableTemplate8HeroBlock from "../editableBlocks/EditableTemplate8HeroBlock";
import EditableTemplate8StoriesBlock from "../editableBlocks/EditableTemplate8StoriesBlock";
import EditableTemplate8GalleryBlock from "../editableBlocks/EditableTemplate8GalleryBlock";
import EditableTemplate8TestimonialsBlock from "../editableBlocks/EditableTemplate8TestimonialsBlock";
import EditableTemplate8BookingBlock from "../editableBlocks/EditableTemplate8BookingBlock";
import EditableTemplate8FooterBlock from "../editableBlocks/EditableTemplate8FooterBlock";

// Section component mapping - now includes navbar
const SECTION_COMPONENTS = {
  navbar: EditableTemplate8NavbarBlock,
  hero: EditableTemplate8HeroBlock,
  stories: EditableTemplate8StoriesBlock,
  gallery: EditableTemplate8GalleryBlock,
  testimonials: EditableTemplate8TestimonialsBlock,
  booking: EditableTemplate8BookingBlock,
} as const;

interface Template8SectionRendererProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isProductionPreview: boolean;
  siteType: string;
  visibleSections: string[];
}

// Error boundary component for individual sections - now silent for users
const SectionErrorBoundary: React.FC<{ 
  children: React.ReactNode; 
  sectionId: string;
  isProductionPreview: boolean;
}> = ({ children, sectionId, isProductionPreview }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [sectionId]);

  if (hasError) {
    // Log error for debugging but don't show to users
    console.error(`[Template8SectionRenderer] Error in section: ${sectionId}`);
    
    // In production preview, show nothing (graceful degradation)
    if (isProductionPreview) {
      return null;
    }
    
    // Only show error in admin/editing mode
    return (
      <div className="min-h-[100px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg m-2 p-4">
        <div className="text-center">
          <p className="text-red-600 text-sm">Section rendering error (admin only)</p>
          <p className="text-red-500 text-xs">Check console for details</p>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`[Template8SectionRenderer] Error rendering section ${sectionId}:`, error);
    setHasError(true);
    return null;
  }
};

export const Template8SectionRenderer: React.FC<Template8SectionRendererProps> = ({
  pageData,
  onUpdate,
  isProductionPreview,
  siteType,
  visibleSections
}) => {
  console.log('[Template8SectionRenderer] Rendering with data:', {
    hasPageData: !!pageData,
    visibleSections,
    siteType,
    isProductionPreview
  });

  // Ensure we have valid page data
  if (!pageData) {
    console.warn('[Template8SectionRenderer] No page data provided');
    
    // In production preview, show a clean loading state
    if (isProductionPreview) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }
    
    // In admin mode, show more detailed message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Website...</h2>
          <p className="text-gray-500">Please wait while we prepare your site</p>
        </div>
      </div>
    );
  }

  // Render sections dynamically based on configuration
  const renderSections = () => {
    if (!visibleSections || visibleSections.length === 0) {
      console.warn('[Template8SectionRenderer] No visible sections configured');
      
      // In production, show nothing rather than an error
      if (isProductionPreview) {
        return null;
      }
      
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No sections configured for this site</p>
        </div>
      );
    }

    return visibleSections
      .filter(sectionId => sectionId !== 'navbar' && sectionId !== 'footer') // Handle navbar and footer separately
      .map((sectionId) => {
        const SectionComponent = SECTION_COMPONENTS[sectionId as keyof typeof SECTION_COMPONENTS];
        
        if (!SectionComponent) {
          // Log missing section for debugging but don't show error to users
          console.warn(`[Template8SectionRenderer] Section not available: ${sectionId}`);
          
          // In production preview, skip unknown sections silently
          if (isProductionPreview) {
            return null;
          }
          
          // Only show error in admin mode
          return (
            <SectionErrorBoundary key={sectionId} sectionId={sectionId} isProductionPreview={isProductionPreview}>
              <div className="min-h-[100px] flex items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg m-2 p-4">
                <p className="text-yellow-700 text-sm">Section "{sectionId}" not available (admin only)</p>
              </div>
            </SectionErrorBoundary>
          );
        }

        return (
          <SectionErrorBoundary key={sectionId} sectionId={sectionId} isProductionPreview={isProductionPreview}>
            <SectionComponent
              pageData={pageData}
              onUpdate={onUpdate}
              isProductionPreview={isProductionPreview}
            />
          </SectionErrorBoundary>
        );
      });
  };

  return (
    <>
      {/* Navbar - always visible with error boundary */}
      <SectionErrorBoundary sectionId="navbar" isProductionPreview={isProductionPreview}>
        <EditableTemplate8NavbarBlock 
          pageData={pageData} 
          onUpdate={onUpdate} 
          isProductionPreview={isProductionPreview}
        />
      </SectionErrorBoundary>
      
      {/* Dynamic sections based on configuration */}
      {renderSections()}
      
      {/* Footer - always visible with site type information */}
      <SectionErrorBoundary sectionId="footer" isProductionPreview={isProductionPreview}>
        <EditableTemplate8FooterBlock 
          pageData={pageData} 
          onUpdate={onUpdate}
          isProductionPreview={isProductionPreview}
          siteType={siteType}
        />
      </SectionErrorBoundary>
    </>
  );
};

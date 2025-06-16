
import React from "react";
import SectionManagerPanel from "../../components/SectionManagerPanel";
import UniversalErrorBoundary from "@/components/common/UniversalErrorBoundary";
import { editingSections } from "../editingSections";

export const sectionManagerSection = {
  id: 'section-manager',
  name: 'Section Manager',
  description: 'Control section visibility and order',
  component: ({ pageData, onUpdate }: { pageData: any; onUpdate: (updates: any) => void }) => {
    
    // Get current section configuration or use defaults
    const currentSectionConfig = pageData?.sectionConfig || {
      visibleSections: ['navbar', 'hero', 'stories', 'gallery', 'testimonials', 'booking', 'footer'],
      sectionOrder: ['navbar', 'hero', 'stories', 'gallery', 'testimonials', 'booking', 'footer']
    };

    // Map editing sections to include visibility status
    const sectionsWithVisibility = editingSections.map(section => ({
      ...section,
      isVisible: currentSectionConfig.visibleSections.includes(section.id)
    }));

    // Sort sections by current order
    const orderedSections = sectionsWithVisibility.sort((a, b) => {
      const aIndex = currentSectionConfig.sectionOrder.indexOf(a.id);
      const bIndex = currentSectionConfig.sectionOrder.indexOf(b.id);
      return aIndex - bIndex;
    });

    const handleReorderSections = (reorderedSections: any[]) => {
      try {
        const newSectionOrder = reorderedSections.map(section => section.id);
        
        onUpdate({
          sectionConfig: {
            ...currentSectionConfig,
            sectionOrder: newSectionOrder
          }
        });
      } catch (error) {
        console.error('Error reordering sections:', error);
      }
    };

    const handleToggleSectionVisibility = (sectionId: string) => {
      try {
        const isCurrentlyVisible = currentSectionConfig.visibleSections.includes(sectionId);
        
        let newVisibleSections;
        if (isCurrentlyVisible) {
          newVisibleSections = currentSectionConfig.visibleSections.filter(id => id !== sectionId);
        } else {
          newVisibleSections = [...currentSectionConfig.visibleSections, sectionId];
        }

        onUpdate({
          sectionConfig: {
            ...currentSectionConfig,
            visibleSections: newVisibleSections
          }
        });
      } catch (error) {
        console.error('Error toggling section visibility:', error);
      }
    };

    const handleAddSection = () => {
      // For now, just show a simple alert - this could be expanded to show a modal
      alert('Add Section functionality - would show a modal to select from available sections');
    };

    const handleDeleteSection = (sectionId: string) => {
      try {
        // Prevent deletion of essential sections
        if (['navbar', 'hero'].includes(sectionId)) {
          alert('Essential sections (Navbar, Hero) cannot be deleted.');
          return;
        }

        // Remove from both visible sections and section order
        const newVisibleSections = currentSectionConfig.visibleSections.filter(id => id !== sectionId);
        const newSectionOrder = currentSectionConfig.sectionOrder.filter(id => id !== sectionId);

        onUpdate({
          sectionConfig: {
            visibleSections: newVisibleSections,
            sectionOrder: newSectionOrder
          }
        });
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    };

    return (
      <UniversalErrorBoundary context="Section Manager">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Section Manager</h2>
            <p className="text-gray-600">
              Control which sections appear on your site and change their order by dragging them around.
            </p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Essential sections like Navbar and Hero cannot be removed. 
                All changes are saved automatically.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <SectionManagerPanel 
              pageData={pageData}
              onUpdate={onUpdate}
              sections={orderedSections}
              onReorderSections={handleReorderSections}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              onToggleSectionVisibility={handleToggleSectionVisibility}
            />
          </div>
        </div>
      </UniversalErrorBoundary>
    );
  }
};

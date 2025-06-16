
import { useMemo } from 'react';

interface SectionConfig {
  visibleSections: string[];
  sectionOrder: string[];
}

export const useSectionManager = (pageData: any) => {
  const sectionConfig: SectionConfig = useMemo(() => {
    return pageData?.sectionConfig || {
      visibleSections: ['navbar', 'hero', 'stories', 'gallery', 'testimonials', 'booking', 'footer'],
      sectionOrder: ['navbar', 'hero', 'stories', 'gallery', 'testimonials', 'booking', 'footer']
    };
  }, [pageData?.sectionConfig]);

  const getVisibleSections = () => {
    return sectionConfig.sectionOrder.filter(sectionId => 
      sectionConfig.visibleSections.includes(sectionId)
    );
  };

  const isSectionVisible = (sectionId: string) => {
    return sectionConfig.visibleSections.includes(sectionId);
  };

  const getSectionIndex = (sectionId: string) => {
    const visibleSections = getVisibleSections();
    return visibleSections.indexOf(sectionId);
  };

  const getTotalVisibleSections = () => {
    return getVisibleSections().length;
  };

  const updateSectionConfig = (updates: Partial<SectionConfig>) => {
    return {
      sectionConfig: {
        ...sectionConfig,
        ...updates
      }
    };
  };

  return {
    sectionConfig,
    getVisibleSections,
    isSectionVisible,
    getSectionIndex,
    getTotalVisibleSections,
    updateSectionConfig
  };
};

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSectionManager } from './useSectionManager';

interface SectionElement {
  id: string;
  name: string;
  element: HTMLElement | null;
  isVisible: boolean;
  boundingRect: DOMRect | null;
}

interface UseSectionDetectionProps {
  pageData: any;
  onSectionChange?: (sectionId: string, index: number) => void;
}

export const useSectionDetection = ({ pageData, onSectionChange }: UseSectionDetectionProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionElements, setSectionElements] = useState<SectionElement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { getVisibleSections, isSectionVisible } = useSectionManager(pageData);

  // Section selector strategies
  const getSectionSelectors = (sectionId: string): string[] => {
    const baseSelectors = [
      `[data-section="${sectionId}"]`,
      `[data-section-id="${sectionId}"]`,
      `#${sectionId}-section`,
      `.${sectionId}-section`
    ];

    // Add section-specific selectors
    switch (sectionId) {
      case 'navbar':
        return [...baseSelectors, 'nav', '[role="navigation"]', 'header nav'];
      case 'hero':
        return [...baseSelectors, '.hero', '[class*="hero"]', '.hero-section', 'section:first-of-type'];
      case 'gallery':
        return [...baseSelectors, '.gallery', '[class*="gallery"]', '.gallery-section'];
      case 'testimonials':
        return [...baseSelectors, '.testimonials', '[class*="testimonial"]', '.testimonials-section'];
      case 'stories':
        return [...baseSelectors, '.stories', '[class*="stories"]', '.stories-section'];
      case 'booking':
        return [...baseSelectors, '.booking', '[class*="booking"]', '.booking-section'];
      case 'footer':
        return [...baseSelectors, 'footer', '[role="contentinfo"]'];
      default:
        return baseSelectors;
    }
  };

  // Find section element using multiple strategies
  const findSectionElement = useCallback((sectionId: string): HTMLElement | null => {
    const selectors = getSectionSelectors(sectionId);
    
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          // Add data attribute for future identification
          if (!element.hasAttribute('data-section')) {
            element.setAttribute('data-section', sectionId);
          }
          return element;
        }
      } catch (error) {
        console.warn(`Invalid selector: ${selector}`);
      }
    }
    
    return null;
  }, []);

  // Initialize section elements
  const initializeSections = useCallback(() => {
    const visibleSections = getVisibleSections();
    const sections: SectionElement[] = [];

    visibleSections.forEach((sectionId) => {
      const element = findSectionElement(sectionId);
      
      sections.push({
        id: sectionId,
        name: sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
        element,
        isVisible: isSectionVisible(sectionId),
        boundingRect: element?.getBoundingClientRect() || null
      });
    });

    setSectionElements(sections);
    setIsInitialized(true);
    
    return sections;
  }, [getVisibleSections, isSectionVisible, findSectionElement]);

  // Update bounding rects
  const updateBoundingRects = useCallback(() => {
    setSectionElements(prev => 
      prev.map(section => ({
        ...section,
        boundingRect: section.element?.getBoundingClientRect() || null
      }))
    );
  }, []);

  // Setup intersection observer
  const setupIntersectionObserver = useCallback((sections: SectionElement[]) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // Trigger when section is well into viewport
      threshold: [0.1, 0.3, 0.5, 0.7]
    };

    observerRef.current = new IntersectionObserver((entries) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce the section change to avoid rapid switching
      timeoutRef.current = setTimeout(() => {
        let maxIntersectionRatio = 0;
        let newSectionIndex = currentSectionIndex;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
            const sectionIndex = sections.findIndex(s => s.element === entry.target);
            if (sectionIndex !== -1) {
              maxIntersectionRatio = entry.intersectionRatio;
              newSectionIndex = sectionIndex;
            }
          }
        });

        if (newSectionIndex !== currentSectionIndex) {
          setCurrentSectionIndex(newSectionIndex);
          const newSection = sections[newSectionIndex];
          if (newSection && onSectionChange) {
            onSectionChange(newSection.id, newSectionIndex);
          }
        }
      }, 150); // 150ms debounce
    }, observerOptions);

    // Observe all section elements
    sections.forEach(section => {
      if (section.element) {
        observerRef.current?.observe(section.element);
      }
    });
  }, [currentSectionIndex, onSectionChange]);

  // Initialize on mount and data changes
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      const sections = initializeSections();
      if (sections.length > 0) {
        setupIntersectionObserver(sections);
      }
    }, 100);

    return () => clearTimeout(initTimeout);
  }, [pageData, initializeSections, setupIntersectionObserver]);

  // Update bounding rects on scroll and resize
  useEffect(() => {
    const handleScroll = () => updateBoundingRects();
    const handleResize = () => updateBoundingRects();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateBoundingRects]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Navigation methods
  const scrollToSection = useCallback((sectionId: string | number) => {
    const section = typeof sectionId === 'string' 
      ? sectionElements.find(s => s.id === sectionId)
      : sectionElements[sectionId];
    
    if (section?.element) {
      section.element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      
      // Update current section immediately
      const index = sectionElements.indexOf(section);
      if (index !== -1) {
        setCurrentSectionIndex(index);
        if (onSectionChange) {
          onSectionChange(section.id, index);
        }
      }
    }
  }, [sectionElements, onSectionChange]);

  const goToNextSection = useCallback(() => {
    const nextIndex = Math.min(currentSectionIndex + 1, sectionElements.length - 1);
    if (nextIndex !== currentSectionIndex) {
      scrollToSection(nextIndex);
    }
  }, [currentSectionIndex, sectionElements.length, scrollToSection]);

  const goToPreviousSection = useCallback(() => {
    const prevIndex = Math.max(currentSectionIndex - 1, 0);
    if (prevIndex !== currentSectionIndex) {
      scrollToSection(prevIndex);
    }
  }, [currentSectionIndex, scrollToSection]);

  const getCurrentSection = useCallback(() => {
    return sectionElements[currentSectionIndex] || null;
  }, [sectionElements, currentSectionIndex]);

  return {
    currentSectionIndex,
    sectionElements,
    isInitialized,
    scrollToSection,
    goToNextSection,
    goToPreviousSection,
    getCurrentSection,
    updateBoundingRects
  };
};
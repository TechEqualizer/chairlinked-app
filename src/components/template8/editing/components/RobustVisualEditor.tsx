import React, { useRef, useEffect, useState, useMemo } from 'react';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';

interface RobustVisualEditorProps {
  sectionData: any;
  onElementSelect: (element: EnhancedSelectedElement) => void;
  overlaysVisible: boolean;
}

interface SelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  properties: Record<string, any>;
}

interface EnhancedSelectedElement extends SelectedElement {
  sectionId: string;
  sectionName: string;
  elementRole: string;
  dataPath: string;
}

const RobustVisualEditor: React.FC<RobustVisualEditorProps> = ({
  sectionData,
  onElementSelect,
  overlaysVisible
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Memoize structural data to detect when re-setup is actually needed
  const structuralData = useMemo(() => {
    if (!sectionData) return '';
    // Only track structural changes that require element re-detection
    const structural = {
      sectionOrder: sectionData.sectionOrder,
      visibleSections: sectionData.visibleSections,
      heroImage: sectionData.heroImage,
      imagesCount: sectionData.images?.length,
      storiesCount: sectionData.stories?.length,
      testimonialsCount: sectionData.testimonials?.length
    };
    return JSON.stringify(structural);
  }, [sectionData]);

  // Only re-setup when structural data actually changes
  useEffect(() => {
    console.log('[RobustVisualEditor] Structural change detected, triggering re-setup');
    setRenderKey(prev => prev + 1);
  }, [structuralData]);

  // Section detection utilities
  const getSectionSelectors = (sectionId: string): string[] => {
    const baseSelectors = [
      `[data-section="${sectionId}"]`,
      `[data-section-id="${sectionId}"]`,
      `#${sectionId}-section`,
      `.${sectionId}-section`
    ];

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

  // Find which section an element belongs to
  const detectElementSection = (element: HTMLElement): { sectionId: string; sectionName: string } => {
    const sectionOrder = ['navbar', 'hero', 'gallery', 'stories', 'testimonials', 'booking', 'footer'];
    
    // First, check if element has section data attribute
    let currentElement: HTMLElement | null = element;
    while (currentElement && currentElement !== document.body) {
      const sectionAttr = currentElement.getAttribute('data-section');
      if (sectionAttr) {
        return {
          sectionId: sectionAttr,
          sectionName: sectionAttr.charAt(0).toUpperCase() + sectionAttr.slice(1)
        };
      }
      currentElement = currentElement.parentElement;
    }

    // Check each section using selectors
    for (const sectionId of sectionOrder) {
      const selectors = getSectionSelectors(sectionId);
      for (const selector of selectors) {
        try {
          const sectionElement = document.querySelector(selector);
          if (sectionElement && sectionElement.contains(element)) {
            // Add data attribute for future identification
            (sectionElement as HTMLElement).setAttribute('data-section', sectionId);
            return {
              sectionId,
              sectionName: sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
            };
          }
        } catch (error) {
          // Invalid selector, continue
        }
      }
    }

    return { sectionId: 'unknown', sectionName: 'Unknown' };
  };

  // Enhanced element role detection for comprehensive editing
  const getElementRole = (element: HTMLElement, sectionId: string): string => {
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    const textContent = element.textContent?.toLowerCase() || '';
    const style = window.getComputedStyle(element);

    // Check if element is a background container
    const isBackgroundElement = className.includes('bg-') || className.includes('background') || 
                               style.backgroundImage !== 'none' || className.includes('hero-bg') ||
                               className.includes('section-bg') || element.dataset.background;

    // Role detection based on section and element characteristics
    switch (sectionId) {
      case 'hero':
        if (isBackgroundElement) return 'background';
        if (tagName === 'img' && (className.includes('hero-image') || className.includes('hero-img'))) return 'hero-image';
        if (tagName === 'h1' || className.includes('hero-title') || className.includes('title')) return 'title';
        if (tagName === 'p' || className.includes('hero-subtitle') || className.includes('subtitle')) return 'subtitle';
        if (tagName === 'button' || className.includes('cta') || className.includes('button')) return 'cta';
        if (className.includes('description')) return 'description';
        if (tagName === 'img') return 'hero-image';
        if (tagName === 'div' && (className.includes('hero') || className.includes('banner'))) return 'hero-container';
        break;
      case 'navbar':
        if (className.includes('logo') || textContent.includes('logo')) return 'logo';
        if (tagName === 'img' && className.includes('logo')) return 'logo-image';
        if (tagName === 'a' || className.includes('nav-link')) return 'nav-link';
        if (className.includes('brand')) return 'brand';
        if (tagName === 'nav' || tagName === 'header') return 'nav-container';
        break;
      case 'gallery':
        if (tagName === 'img' || className.includes('gallery-image')) return 'gallery-image';
        if (className.includes('caption')) return 'caption';
        if (className.includes('title')) return 'gallery-title';
        if (tagName === 'div' && className.includes('gallery')) return 'gallery-container';
        break;
      case 'testimonials':
        if (tagName === 'img' && (className.includes('avatar') || className.includes('profile'))) return 'testimonial-avatar';
        if (className.includes('testimonial-text') || className.includes('quote')) return 'testimonial-text';
        if (className.includes('author') || className.includes('name')) return 'author';
        if (className.includes('rating')) return 'rating';
        if (tagName === 'div' && className.includes('testimonial')) return 'testimonial-container';
        break;
      case 'stories':
        if (tagName === 'img' || className.includes('story-image')) return 'story-image';
        if (className.includes('story-text')) return 'story-text';
        if (tagName === 'div' && className.includes('story')) return 'story-container';
        break;
      case 'booking':
        if (tagName === 'button' || className.includes('book') || className.includes('cta')) return 'booking-cta';
        if (className.includes('contact')) return 'contact-info';
        if (tagName === 'form') return 'booking-form';
        if (tagName === 'input') return 'form-input';
        break;
      case 'footer':
        if (className.includes('contact')) return 'contact';
        if (className.includes('social')) return 'social';
        if (className.includes('copyright')) return 'copyright';
        if (tagName === 'footer') return 'footer-container';
        break;
    }

    // Enhanced fallback role detection
    if (tagName === 'img') return 'image';
    if (tagName === 'video') return 'video';
    if (tagName === 'iframe') return 'iframe';
    if (isBackgroundElement) return 'background';
    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') return 'heading';
    if (tagName === 'p') return 'paragraph';
    if (tagName === 'button') return 'button';
    if (tagName === 'a') return 'link';
    if (tagName === 'div' || tagName === 'section') return 'container';
    if (tagName === 'span') return 'text';
    
    return 'element';
  };

  // Generate data path for Template8Data updates
  const generateDataPath = (sectionId: string, elementRole: string, element: HTMLElement): string => {
    switch (sectionId) {
      case 'hero':
        if (elementRole === 'title') return 'tagline';
        if (elementRole === 'subtitle') return 'description';
        if (elementRole === 'cta') return 'ctaText';
        break;
      case 'navbar':
        if (elementRole === 'brand') return 'businessName';
        break;
      case 'gallery':
        if (elementRole === 'image') {
          // Find image index if possible
          const imgElements = element.closest('[data-section="gallery"]')?.querySelectorAll('img');
          if (imgElements) {
            const index = Array.from(imgElements).indexOf(element as HTMLImageElement);
            return `images[${index}]`;
          }
        }
        break;
      case 'testimonials':
        // Find testimonial index
        const testimonialContainer = element.closest('[class*="testimonial"]');
        if (testimonialContainer) {
          const allTestimonials = document.querySelectorAll('[class*="testimonial"]');
          const index = Array.from(allTestimonials).indexOf(testimonialContainer);
          if (elementRole === 'testimonial-text') return `testimonials[${index}].content`;
          if (elementRole === 'author') return `testimonials[${index}].author`;
        }
        break;
    }
    
    // Generic fallback
    return `${sectionId}.${elementRole}`;
  };

  // Enhanced setup with re-setup capability for content changes
  useEffect(() => {
    // For Quick Text Editor changes, use minimal delay to prevent glitches
    setSetupComplete(false);
    
    const timer = setTimeout(() => {
      setupEditing();
      setSetupComplete(true);
    }, 100); // Reduced from 1500ms to 100ms for faster response

    return () => clearTimeout(timer);
  }, [renderKey]); // Re-setup when content changes

  const setupEditing = () => {
    const container = containerRef.current;
    if (!container) return;

    console.log('[RobustVisualEditor] Setting up editing for container:', container);

    // Clear any existing editor setup
    const existingEditorElements = container.querySelectorAll('[data-editor-ready="true"]');
    existingEditorElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.removeAttribute('data-editor-ready');
      htmlElement.classList.remove('editor-selected');
      htmlElement.style.outline = '';
      htmlElement.style.cursor = '';
      // Remove existing event listeners by cloning and replacing the element
      const newElement = htmlElement.cloneNode(true);
      htmlElement.parentNode?.replaceChild(newElement, htmlElement);
    });

    // Find all editable elements - expanded to include images, divs, sections, and more
    const editableElements = container.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, button, a, img, div, section, article, aside, header, footer, nav, main, figure, video, picture, iframe'
    );

    console.log(`[RobustVisualEditor] Found ${editableElements.length} editable elements`);

    editableElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Skip certain elements that shouldn't be directly editable
      if (htmlElement.closest('.editor-ui') || 
          htmlElement.closest('[data-no-edit="true"]') ||
          htmlElement.classList.contains('editing-overlay')) {
        return;
      }
      
      // Mark as setup
      htmlElement.dataset.editorReady = 'true';
      console.log(`[RobustVisualEditor] Setting up element ${index}:`, htmlElement.tagName, htmlElement.className);
      
      // Add event listeners
      htmlElement.addEventListener('mouseenter', () => {
        if (overlaysVisible) {
          htmlElement.style.outline = '2px solid #3B82F6';
          htmlElement.style.cursor = 'pointer';
        }
      });
      
      htmlElement.addEventListener('mouseleave', () => {
        if (!htmlElement.classList.contains('editor-selected')) {
          htmlElement.style.outline = '';
          htmlElement.style.cursor = '';
        }
      });
      
      htmlElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear previous selections
        container.querySelectorAll('.editor-selected').forEach(selected => {
          selected.classList.remove('editor-selected');
          (selected as HTMLElement).style.outline = '';
        });
        
        // Select current element
        htmlElement.classList.add('editor-selected');
        htmlElement.style.outline = '2px solid #EF4444';
        
        // Get element properties with better detection
        const computedStyles = window.getComputedStyle(htmlElement);
        
        // Get element content based on type
        let textContent = '';
        let imageSource = '';
        let backgroundInfo = {};
        
        if (htmlElement.tagName === 'IMG') {
          textContent = (htmlElement as HTMLImageElement).alt || 'Image';
          imageSource = (htmlElement as HTMLImageElement).src;
        } else {
          textContent = htmlElement.textContent || '';
          if (htmlElement.children.length > 0) {
            // For elements with children, try to get the main text
            const textNodes = Array.from(htmlElement.childNodes)
              .filter(node => node.nodeType === Node.TEXT_NODE)
              .map(node => node.textContent)
              .join(' ')
              .trim();
            if (textNodes) {
              textContent = textNodes;
            }
          }
        }
        
        // Extract background information
        if (computedStyles.backgroundImage !== 'none') {
          backgroundInfo = {
            backgroundImage: computedStyles.backgroundImage,
            backgroundColor: computedStyles.backgroundColor,
            backgroundSize: computedStyles.backgroundSize,
            backgroundPosition: computedStyles.backgroundPosition,
            backgroundRepeat: computedStyles.backgroundRepeat
          };
        }

        // Detect section context
        const sectionContext = detectElementSection(htmlElement);
        const elementRole = getElementRole(htmlElement, sectionContext.sectionId);
        const dataPath = generateDataPath(sectionContext.sectionId, elementRole, htmlElement);
        
        const enhancedElementData: EnhancedSelectedElement = {
          id: htmlElement.id || `element-${index}`,
          type: getElementType(htmlElement),
          element: htmlElement,
          selector: generateSelector(htmlElement),
          sectionId: sectionContext.sectionId,
          sectionName: sectionContext.sectionName,
          elementRole,
          dataPath,
          properties: {
            textContent,
            imageSource,
            backgroundInfo,
            color: computedStyles.color,
            fontSize: computedStyles.fontSize,
            fontWeight: computedStyles.fontWeight,
            textAlign: computedStyles.textAlign,
            backgroundColor: computedStyles.backgroundColor,
            padding: computedStyles.padding,
            margin: computedStyles.margin,
            borderRadius: computedStyles.borderRadius,
            // Enhanced comprehensive properties
            fontFamily: computedStyles.fontFamily,
            lineHeight: computedStyles.lineHeight,
            display: computedStyles.display,
            width: computedStyles.width,
            height: computedStyles.height,
            position: computedStyles.position,
            zIndex: computedStyles.zIndex,
            opacity: computedStyles.opacity,
            transform: computedStyles.transform,
            boxShadow: computedStyles.boxShadow,
            border: computedStyles.border,
            borderWidth: computedStyles.borderWidth,
            borderStyle: computedStyles.borderStyle,
            borderColor: computedStyles.borderColor
          }
        };
        
        console.log('Enhanced element selected:', enhancedElementData);
        
        onElementSelect(enhancedElementData);
      });
    });
  };

  const getElementType = (element: HTMLElement): string => {
    const tagName = element.tagName;
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tagName)) return 'heading';
    if (tagName === 'P') return 'paragraph';
    if (tagName === 'BUTTON') return 'button';
    if (tagName === 'A') return 'link';
    if (tagName === 'IMG') return 'image';
    if (tagName === 'VIDEO') return 'video';
    if (tagName === 'IFRAME') return 'iframe';
    if (tagName === 'DIV') return 'container';
    if (tagName === 'SECTION') return 'section';
    if (tagName === 'ARTICLE') return 'article';
    if (tagName === 'ASIDE') return 'aside';
    if (tagName === 'HEADER') return 'header';
    if (tagName === 'FOOTER') return 'footer';
    if (tagName === 'NAV') return 'navigation';
    if (tagName === 'MAIN') return 'main';
    return 'text';
  };

  const generateSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    return element.tagName.toLowerCase() + (element.className ? `.${element.className.split(' ')[0]}` : '');
  };

  return (
    <div className="relative min-h-full">
      <div 
        ref={containerRef}
        className="relative"
        style={{ 
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 1 
        }}
      >
        <ChairLinkedRenderer 
          key={renderKey}
          config={sectionData}
          logoUrl={sectionData.logoUrl}
          isProductionPreview={true}
          siteType="demo"
          readOnly={false}
        />
      </div>
      
      {/* Setup status indicator - Fixed position so it doesn't scroll */}
      {!setupComplete && (
        <div className="fixed top-20 left-4 bg-blue-600 text-white px-3 py-2 rounded text-sm z-50">
          Setting up editor...
        </div>
      )}
      
      {setupComplete && overlaysVisible && (
        <div className="fixed top-20 left-4 bg-green-600 text-white px-3 py-2 rounded text-sm z-50">
          Click any text to edit
        </div>
      )}
    </div>
  );
};

export default RobustVisualEditor;
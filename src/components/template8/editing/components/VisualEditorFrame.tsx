import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';

interface VisualEditorFrameProps {
  sectionData: any;
  onElementSelect: (element: any) => void;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
  overlaysVisible: boolean;
}

interface SelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  properties: Record<string, any>;
}

const VisualEditorFrame = forwardRef<HTMLIFrameElement, VisualEditorFrameProps>(({
  sectionData,
  onElementSelect,
  responsiveMode,
  overlaysVisible
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useImperativeHandle(ref, () => iframeRef.current!);

  // Generate unique ID for iframe communication
  const frameId = `editor-frame-${Date.now()}`;

  // Inject editor scripts into iframe
  const injectEditorScripts = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    // Add editor styles for visual feedback
    const editorStyles = doc.createElement('style');
    editorStyles.textContent = `
      .editor-element-hover {
        outline: 2px solid #3B82F6 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
      }
      
      .editor-element-selected {
        outline: 2px solid #EF4444 !important;
        outline-offset: 2px !important;
        position: relative !important;
      }
      
      .editor-element-selected::after {
        content: attr(data-element-type);
        position: absolute;
        top: -24px;
        left: 0;
        background: #EF4444;
        color: white;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 600;
        border-radius: 4px;
        z-index: 1000;
        pointer-events: none;
      }
      
      .editor-overlay-hidden .editor-element-hover,
      .editor-overlay-hidden .editor-element-selected {
        outline: none !important;
      }
      
      .editor-overlay-hidden .editor-element-selected::after {
        display: none !important;
      }
    `;
    doc.head.appendChild(editorStyles);

    // Add click handler for element selection
    const addElementHandlers = () => {
      const elements = doc.querySelectorAll('[data-editable]');
      
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Add hover effects
        htmlElement.addEventListener('mouseenter', () => {
          if (overlaysVisible) {
            htmlElement.classList.add('editor-element-hover');
          }
        });
        
        htmlElement.addEventListener('mouseleave', () => {
          htmlElement.classList.remove('editor-element-hover');
        });
        
        // Add click handler for selection
        htmlElement.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Remove previous selections
          doc.querySelectorAll('.editor-element-selected').forEach(el => {
            el.classList.remove('editor-element-selected');
          });
          
          // Add selection to clicked element
          htmlElement.classList.add('editor-element-selected');
          
          // Get element properties
          const computedStyles = window.getComputedStyle(htmlElement);
          const elementData: SelectedElement = {
            id: htmlElement.id || `element-${Date.now()}`,
            type: htmlElement.dataset.elementType || htmlElement.tagName.toLowerCase(),
            element: htmlElement,
            selector: generateSelector(htmlElement),
            properties: {
              // Text properties
              color: computedStyles.color,
              fontSize: computedStyles.fontSize,
              fontFamily: computedStyles.fontFamily,
              fontWeight: computedStyles.fontWeight,
              lineHeight: computedStyles.lineHeight,
              textAlign: computedStyles.textAlign,
              
              // Layout properties
              margin: computedStyles.margin,
              padding: computedStyles.padding,
              width: computedStyles.width,
              height: computedStyles.height,
              display: computedStyles.display,
              position: computedStyles.position,
              
              // Background properties
              backgroundColor: computedStyles.backgroundColor,
              backgroundImage: computedStyles.backgroundImage,
              
              // Border properties
              border: computedStyles.border,
              borderRadius: computedStyles.borderRadius,
              
              // Content
              textContent: htmlElement.textContent,
              innerHTML: htmlElement.innerHTML,
              
              // Custom data attributes
              ...Object.fromEntries(
                Array.from(htmlElement.attributes)
                  .filter(attr => attr.name.startsWith('data-'))
                  .map(attr => [attr.name, attr.value])
              )
            }
          };
          
          // Send selection to parent
          onElementSelect(elementData);
        });
      });
    };

    // Generate CSS selector for element
    const generateSelector = (element: HTMLElement): string => {
      if (element.id) return `#${element.id}`;
      
      let selector = element.tagName.toLowerCase();
      
      if (element.className) {
        const classes = element.className.split(' ').filter(c => c.trim());
        if (classes.length > 0) {
          selector += '.' + classes.join('.');
        }
      }
      
      // Add nth-child if needed for uniqueness
      const parent = element.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          child => child.tagName === element.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(element) + 1;
          selector += `:nth-child(${index})`;
        }
      }
      
      return selector;
    };

    // Wait for content to load then add handlers
    if (doc.readyState === 'complete') {
      addElementHandlers();
    } else {
      doc.addEventListener('DOMContentLoaded', addElementHandlers);
    }
  };

  // Update overlay visibility
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    if (overlaysVisible) {
      doc.body.classList.remove('editor-overlay-hidden');
    } else {
      doc.body.classList.add('editor-overlay-hidden');
    }
  }, [overlaysVisible]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIframeReady(true);
    // Wait a bit for content to render, then inject scripts
    setTimeout(() => {
      injectEditorScripts();
    }, 500);
  };

  // Re-inject scripts when data changes
  useEffect(() => {
    if (iframeReady) {
      // Small delay to ensure content has updated
      setTimeout(() => {
        injectEditorScripts();
      }, 100);
    }
  }, [sectionData, iframeReady]);

  // Get responsive classes based on mode
  const getResponsiveClasses = () => {
    switch (responsiveMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-3xl mx-auto';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  // Store reference to the container for cleanup
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up editing capabilities
  const setupEditingCapabilities = () => {
    const container = containerRef.current;
    if (!container) {
      console.log('🚨 [VisualEditorFrame] No container found!');
      return;
    }

    console.log('🚀 [VisualEditorFrame] Setting up editing capabilities');
    console.log('🚀 [VisualEditorFrame] Container:', container);

    // Add data-editable attributes to elements
    const editableElements = container.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], button, a, img, section, header, footer'
    );
    
    console.log('[VisualEditorFrame] Found editable elements:', editableElements.length);
    
    editableElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Skip if already setup
      if (htmlElement.dataset.editorSetup) return;
      
      htmlElement.setAttribute('data-editable', 'true');
      htmlElement.setAttribute('data-element-type', getElementType(htmlElement));
      htmlElement.setAttribute('data-editor-setup', 'true');
      
      // Add hover effects
      const handleMouseEnter = () => {
        if (overlaysVisible && !htmlElement.classList.contains('editor-selected')) {
          htmlElement.style.outline = '3px solid #3B82F6';
          htmlElement.style.outlineOffset = '2px';
          htmlElement.style.cursor = 'pointer';
          htmlElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        }
      };
      
      const handleMouseLeave = () => {
        if (!htmlElement.classList.contains('editor-selected')) {
          htmlElement.style.outline = '';
          htmlElement.style.outlineOffset = '';
          htmlElement.style.cursor = '';
          htmlElement.style.backgroundColor = '';
        }
      };
      
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔥 [VisualEditorFrame] CLICK EVENT TRIGGERED!');
        console.log('🔥 [VisualEditorFrame] Element clicked:', htmlElement);
        console.log('🔥 [VisualEditorFrame] Element tagName:', htmlElement.tagName);
        console.log('🔥 [VisualEditorFrame] Element classes:', htmlElement.className);
        
        // Remove previous selections
        container.querySelectorAll('.editor-selected').forEach(selected => {
          (selected as HTMLElement).classList.remove('editor-selected');
          (selected as HTMLElement).style.outline = '';
        });
        
        // Select current element
        htmlElement.classList.add('editor-selected');
        htmlElement.style.outline = '2px solid #EF4444';
        htmlElement.style.outlineOffset = '2px';
        
        // Get computed styles
        const computedStyles = window.getComputedStyle(htmlElement);
        
        const elementData = {
          id: htmlElement.id || `element-${index}`,
          type: getElementType(htmlElement),
          element: htmlElement,
          selector: generateCSSSelector(htmlElement),
          properties: {
            // Text properties
            color: computedStyles.color,
            fontSize: computedStyles.fontSize,
            fontFamily: computedStyles.fontFamily,
            fontWeight: computedStyles.fontWeight,
            lineHeight: computedStyles.lineHeight,
            textAlign: computedStyles.textAlign,
            
            // Layout properties
            margin: computedStyles.margin,
            padding: computedStyles.padding,
            width: computedStyles.width,
            height: computedStyles.height,
            display: computedStyles.display,
            
            // Background
            backgroundColor: computedStyles.backgroundColor,
            
            // Border
            borderRadius: computedStyles.borderRadius,
            
            // Content
            textContent: htmlElement.textContent,
            innerHTML: htmlElement.innerHTML
          }
        };
        
        console.log('[VisualEditorFrame] Selecting element:', elementData);
        onElementSelect(elementData);
      };
      
      // Add event listeners
      htmlElement.addEventListener('mouseenter', handleMouseEnter);
      htmlElement.addEventListener('mouseleave', handleMouseLeave);
      htmlElement.addEventListener('click', handleClick);
      
      // Store cleanup functions
      (htmlElement as any)._editorCleanup = () => {
        htmlElement.removeEventListener('mouseenter', handleMouseEnter);
        htmlElement.removeEventListener('mouseleave', handleMouseLeave);
        htmlElement.removeEventListener('click', handleClick);
        htmlElement.style.outline = '';
        htmlElement.style.cursor = '';
        delete htmlElement.dataset.editorSetup;
        delete (htmlElement as any)._editorCleanup;
      };
    });
  };

  // Clean up event listeners
  const cleanupEditingCapabilities = () => {
    const container = containerRef.current;
    if (!container) return;
    
    const editableElements = container.querySelectorAll('[data-editor-setup]');
    editableElements.forEach(element => {
      const cleanup = (element as any)._editorCleanup;
      if (cleanup) cleanup();
    });
  };

  // TEMPORARILY DISABLED - will fix step by step
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setupEditingCapabilities();
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timer);
  //     cleanupEditingCapabilities();
  //   };
  // }, []);

  return (
    <div className={`h-full ${getResponsiveClasses()}`}>
      <div 
        ref={containerRef}
        className="h-full overflow-auto"
        style={{ position: 'relative' }}
      >
        <ChairLinkedRenderer 
          config={sectionData}
          logoUrl={sectionData.logoUrl}
          isProductionPreview={true}
          siteType="demo"
          readOnly={false}
        />
      </div>
    </div>
  );
});

// Helper functions
const getElementType = (element: HTMLElement): string => {
  if (element.tagName === 'IMG') return 'image';
  if (element.tagName === 'BUTTON') return 'button';
  if (element.tagName === 'A') return 'link';
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) return 'heading';
  if (element.tagName === 'P') return 'paragraph';
  if (element.classList.contains('hero')) return 'hero';
  if (element.classList.contains('service')) return 'service';
  return 'element';
};

const generateCSSSelector = (element: HTMLElement): string => {
  if (element.id) return `#${element.id}`;
  
  let selector = element.tagName.toLowerCase();
  
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c.trim() && !c.startsWith('editor-'));
    if (classes.length > 0) {
      selector += '.' + classes.slice(0, 2).join('.');
    }
  }
  
  return selector;
};

VisualEditorFrame.displayName = 'VisualEditorFrame';

export default VisualEditorFrame;
import React, { useRef, useEffect, useState } from 'react';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';

interface RobustVisualEditorProps {
  sectionData: any;
  onElementSelect: (element: SelectedElement) => void;
  overlaysVisible: boolean;
}

interface SelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  properties: Record<string, any>;
}

const RobustVisualEditor: React.FC<RobustVisualEditorProps> = ({
  sectionData,
  onElementSelect,
  overlaysVisible
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  // Simple, one-time setup without loops
  useEffect(() => {
    if (setupComplete) return; // Prevent multiple setups

    const timer = setTimeout(() => {
      setupEditing();
      setSetupComplete(true);
    }, 1500); // Give ChairLinkedRenderer time to fully render

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once

  const setupEditing = () => {
    const container = containerRef.current;
    if (!container) return;

    // Find all editable elements
    const editableElements = container.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, button, a'
    );

    editableElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Skip if already setup
      if (htmlElement.dataset.editorReady) return;
      
      // Mark as setup
      htmlElement.dataset.editorReady = 'true';
      
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
        
        // Get the actual text content, handling nested elements
        let textContent = htmlElement.textContent || '';
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
        
        const elementData: SelectedElement = {
          id: htmlElement.id || `element-${index}`,
          type: getElementType(htmlElement),
          element: htmlElement,
          selector: generateSelector(htmlElement),
          properties: {
            textContent,
            color: computedStyles.color,
            fontSize: computedStyles.fontSize,
            fontWeight: computedStyles.fontWeight,
            textAlign: computedStyles.textAlign,
            backgroundColor: computedStyles.backgroundColor,
            padding: computedStyles.padding,
            margin: computedStyles.margin,
            borderRadius: computedStyles.borderRadius,
            // Add more comprehensive properties
            fontFamily: computedStyles.fontFamily,
            lineHeight: computedStyles.lineHeight,
            display: computedStyles.display,
            width: computedStyles.width,
            height: computedStyles.height
          }
        };
        
        console.log('Element selected:', elementData);
        
        onElementSelect(elementData);
      });
    });
  };

  const getElementType = (element: HTMLElement): string => {
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) return 'heading';
    if (element.tagName === 'P') return 'paragraph';
    if (element.tagName === 'BUTTON') return 'button';
    if (element.tagName === 'A') return 'link';
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
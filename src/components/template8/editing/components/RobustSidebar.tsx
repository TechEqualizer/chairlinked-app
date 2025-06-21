import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

// Import section-specific controls
import HeroSectionControls from './section-controls/HeroSectionControls';
import GallerySectionControls from './section-controls/GallerySectionControls';
import TestimonialsSectionControls from './section-controls/TestimonialsSectionControls';
import GenericSectionControls from './section-controls/GenericSectionControls';

interface RobustSidebarProps {
  selectedElement: any;
  sectionData: any;
  onDataUpdate: (updates: any) => void;
}

interface EnhancedSelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  sectionId: string;
  sectionName: string;
  elementRole: string;
  dataPath: string;
  properties: Record<string, any>;
}

const RobustSidebar: React.FC<RobustSidebarProps> = ({
  selectedElement,
  sectionData,
  onDataUpdate
}) => {
  // Force re-render when properties change
  const [, forceUpdate] = React.useState({});
  const triggerUpdate = () => forceUpdate({});
  
  // Enhanced property change handler with smart data binding
  const handleElementPropertyChange = (property: string, value: any) => {
    if (!selectedElement?.element) {
      console.log('No selected element to update');
      return;
    }
    
    const element = selectedElement.element as HTMLElement;
    console.log(`Updating ${property} to:`, value);
    
    try {
      // Apply the change directly to the element
      switch (property) {
        case 'textContent':
          element.textContent = value;
          // Also update inner text nodes if they exist
          if (element.children.length === 0) {
            element.textContent = value;
          } else {
            // For elements with children, try to find text nodes
            const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            if (textNodes.length > 0) {
              textNodes[0].textContent = value;
            } else {
              element.textContent = value;
            }
          }
          break;
          
        case 'color':
          element.style.color = value;
          break;
          
        case 'fontSize':
          element.style.fontSize = typeof value === 'number' ? `${value}px` : value;
          break;
          
        case 'fontWeight':
          element.style.fontWeight = value;
          break;
          
        case 'textAlign':
          element.style.textAlign = value;
          break;
          
        case 'backgroundColor':
          element.style.backgroundColor = value;
          break;
          
        case 'padding':
          element.style.padding = typeof value === 'number' ? `${value}px` : value;
          break;
          
        case 'margin':
          element.style.margin = typeof value === 'number' ? `${value}px` : value;
          break;
          
        case 'borderRadius':
          element.style.borderRadius = typeof value === 'number' ? `${value}px` : value;
          break;

        case 'src':
          if (element.tagName === 'IMG') {
            (element as HTMLImageElement).src = value;
          }
          break;

        case 'alt':
          if (element.tagName === 'IMG') {
            (element as HTMLImageElement).alt = value;
          }
          break;

        case 'border':
          element.style.border = value;
          break;
      }
      
      // Update the selected element's properties for UI sync
      if (selectedElement.properties) {
        selectedElement.properties[property] = value;
      }
      
      console.log(`Successfully updated ${property}`);
      
      // Force UI update
      triggerUpdate();
      
    } catch (error) {
      console.error(`Error updating ${property}:`, error);
    }
  };

  // Render appropriate section controls based on selected element's section
  const renderSectionControls = () => {
    const enhancedElement = selectedElement as EnhancedSelectedElement;
    
    if (!enhancedElement.sectionId) {
      // Fallback to generic controls if section detection failed
      return (
        <GenericSectionControls
          selectedElement={enhancedElement}
          sectionData={sectionData}
          onElementPropertyChange={handleElementPropertyChange}
          onDataUpdate={onDataUpdate}
        />
      );
    }

    switch (enhancedElement.sectionId) {
      case 'hero':
        return (
          <HeroSectionControls
            selectedElement={enhancedElement}
            sectionData={sectionData}
            onElementPropertyChange={handleElementPropertyChange}
            onDataUpdate={onDataUpdate}
          />
        );

      case 'gallery':
        return (
          <GallerySectionControls
            selectedElement={enhancedElement}
            sectionData={sectionData}
            onElementPropertyChange={handleElementPropertyChange}
            onDataUpdate={onDataUpdate}
          />
        );

      case 'testimonials':
        return (
          <TestimonialsSectionControls
            selectedElement={enhancedElement}
            sectionData={sectionData}
            onElementPropertyChange={handleElementPropertyChange}
            onDataUpdate={onDataUpdate}
          />
        );

      case 'navbar':
      case 'stories':
      case 'booking':
      case 'footer':
      default:
        return (
          <GenericSectionControls
            selectedElement={enhancedElement}
            sectionData={sectionData}
            onElementPropertyChange={handleElementPropertyChange}
            onDataUpdate={onDataUpdate}
          />
        );
    }
  };

  if (!selectedElement) {
    return (
      <div className="h-full bg-gray-800 text-white p-6">
        <div className="text-center py-12">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Enhanced Click-to-Edit</h3>
          <p className="text-gray-400 text-sm">Click on any element to start editing:</p>
          <div className="mt-6 text-xs text-gray-500 space-y-2">
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-gray-300 font-medium mb-2">✨ What You Can Edit:</p>
              <p>📝 Text Elements (titles, paragraphs, buttons)</p>
              <p>🖼️ Images (hero images, gallery, avatars)</p>
              <p>🎨 Backgrounds (colors, images, containers)</p>
              <p>🔘 Buttons & Links (styling, text, colors)</p>
              <p>📦 Containers & Sections (layout, spacing)</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-gray-300 font-medium mb-2">🎯 Smart Section Controls:</p>
              <p>Hero • Gallery • Testimonials • Navbar</p>
              <p>Stories • Booking • Footer</p>
            </div>
            <p className="text-blue-400 mt-4">👆 Click anywhere on the preview to start!</p>
          </div>
        </div>
      </div>
    );
  }

  const enhancedElement = selectedElement as EnhancedSelectedElement;

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      {/* Fixed Header with Section Context */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <h3 className="text-lg font-semibold">
            {enhancedElement.sectionName || 'Element'} Editor
          </h3>
        </div>
        <p className="text-xs text-gray-400">
          Section: {enhancedElement.sectionId || 'unknown'} • Role: {enhancedElement.elementRole || 'generic'}
        </p>
        <p className="text-xs text-gray-500 mt-1">{enhancedElement.selector}</p>
        
        {/* Enhanced Debugging Panel */}
        <div className="mt-3 p-2 bg-gray-700 rounded text-xs space-y-1">
          <div className="text-gray-300">Debug Info:</div>
          <div className="text-gray-400">Tag: {enhancedElement.element?.tagName}</div>
          <div className="text-gray-400">Type: {enhancedElement.type}</div>
          <div className="text-gray-400">Section: {enhancedElement.sectionId}</div>
          <div className="text-gray-400">Role: {enhancedElement.elementRole}</div>
          {enhancedElement.properties?.imageSource && (
            <div className="text-gray-400">Image: ✓</div>
          )}
          {enhancedElement.properties?.textContent && (
            <div className="text-gray-400">Text: "{enhancedElement.properties.textContent.substring(0, 30)}..."</div>
          )}
        </div>

        {/* Quick Test Button */}
        <Button
          onClick={() => {
            console.log('🎯 Test button clicked');
            console.log('Enhanced element data:', enhancedElement);
            
            // Test direct element highlighting
            if (enhancedElement.element) {
              enhancedElement.element.style.outline = '3px solid #10B981';
              enhancedElement.element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
              
              // Remove highlight after 2 seconds
              setTimeout(() => {
                enhancedElement.element.style.outline = '2px solid #EF4444';
              }, 2000);
            }
          }}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
        >
          🎯 Highlight & Test
        </Button>
      </div>

      {/* Scrollable Content Section - Dynamic Based on Section */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderSectionControls()}
      </div>
    </div>
  );
};

export default RobustSidebar;
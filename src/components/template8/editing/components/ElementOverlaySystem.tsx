import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Move, Copy, Trash2, Settings } from 'lucide-react';

interface ElementOverlaySystemProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  selectedElement: any;
  onElementSelect: (element: any) => void;
}

interface ElementBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

const ElementOverlaySystem: React.FC<ElementOverlaySystemProps> = ({
  iframeRef,
  selectedElement,
  onElementSelect
}) => {
  const [hoveredElement, setHoveredElement] = useState<any>(null);
  const [hoveredBounds, setHoveredBounds] = useState<ElementBounds | null>(null);
  const [selectedBounds, setSelectedBounds] = useState<ElementBounds | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Calculate element bounds relative to the iframe
  const calculateElementBounds = (element: HTMLElement): ElementBounds | null => {
    if (!element || !iframeRef.current) return null;

    const rect = element.getBoundingClientRect();
    const iframeRect = iframeRef.current.getBoundingClientRect();

    return {
      top: rect.top - iframeRect.top,
      left: rect.left - iframeRect.left,
      width: rect.width,
      height: rect.height
    };
  };

  // Update selected element bounds
  useEffect(() => {
    if (selectedElement?.element) {
      const bounds = calculateElementBounds(selectedElement.element);
      setSelectedBounds(bounds);
    } else {
      setSelectedBounds(null);
    }
  }, [selectedElement]);

  // Handle element actions
  const handleElementAction = (action: string) => {
    if (!selectedElement) return;

    switch (action) {
      case 'edit':
        // Focus on the element for inline editing
        if (selectedElement.element) {
          selectedElement.element.focus();
        }
        break;
      case 'duplicate':
        // TODO: Implement element duplication
        console.log('Duplicate element:', selectedElement);
        break;
      case 'delete':
        // TODO: Implement element deletion
        console.log('Delete element:', selectedElement);
        break;
      case 'settings':
        // Open advanced settings - this should open the sidebar
        break;
    }
  };

  // Selection overlay with action buttons
  const SelectionOverlay = ({ bounds }: { bounds: ElementBounds }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute pointer-events-none"
      style={{
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      }}
    >
      {/* Selection border */}
      <div className="absolute inset-0 border-2 border-red-500 bg-red-500/10 rounded-sm" />
      
      {/* Element type label */}
      <div className="absolute -top-8 left-0 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-sm">
        {selectedElement?.type || 'Element'}
      </div>
      
      {/* Action buttons */}
      <div className="absolute -top-8 right-0 flex items-center gap-1 pointer-events-auto">
        <button
          onClick={() => handleElementAction('edit')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-sm transition-colors"
          title="Edit element"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        
        <button
          onClick={() => handleElementAction('duplicate')}
          className="bg-green-600 hover:bg-green-700 text-white p-1 rounded-sm transition-colors"
          title="Duplicate element"
        >
          <Copy className="w-3 h-3" />
        </button>
        
        <button
          onClick={() => handleElementAction('settings')}
          className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded-sm transition-colors"
          title="Element settings"
        >
          <Settings className="w-3 h-3" />
        </button>
        
        <button
          onClick={() => handleElementAction('delete')}
          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-sm transition-colors"
          title="Delete element"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      
      {/* Resize handles */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-se-resize pointer-events-auto" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-ne-resize pointer-events-auto" />
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-nw-resize pointer-events-auto" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 border border-white rounded-sm cursor-sw-resize pointer-events-auto" />
    </motion.div>
  );

  // Hover overlay
  const HoverOverlay = ({ bounds }: { bounds: ElementBounds }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute pointer-events-none"
      style={{
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      }}
    >
      <div className="absolute inset-0 border-2 border-blue-400 bg-blue-400/10 rounded-sm" />
      
      {/* Hover label */}
      <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-sm">
        {hoveredElement?.type || 'Element'}
      </div>
    </motion.div>
  );

  // Spacing guides
  const SpacingGuides = ({ bounds }: { bounds: ElementBounds }) => (
    <div className="absolute pointer-events-none">
      {/* Horizontal guides */}
      <div 
        className="absolute h-px bg-blue-400 opacity-50"
        style={{
          top: bounds.top,
          left: 0,
          right: 0
        }}
      />
      <div 
        className="absolute h-px bg-blue-400 opacity-50"
        style={{
          top: bounds.top + bounds.height,
          left: 0,
          right: 0
        }}
      />
      
      {/* Vertical guides */}
      <div 
        className="absolute w-px bg-blue-400 opacity-50"
        style={{
          left: bounds.left,
          top: 0,
          bottom: 0
        }}
      />
      <div 
        className="absolute w-px bg-blue-400 opacity-50"
        style={{
          left: bounds.left + bounds.width,
          top: 0,
          bottom: 0
        }}
      />
    </div>
  );

  return (
    <div 
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none z-10"
    >
      <AnimatePresence>
        {/* Hover overlay */}
        {hoveredBounds && hoveredElement && !selectedElement && (
          <HoverOverlay bounds={hoveredBounds} />
        )}
        
        {/* Selection overlay */}
        {selectedBounds && selectedElement && (
          <SelectionOverlay bounds={selectedBounds} />
        )}
        
        {/* Spacing guides */}
        {selectedBounds && selectedElement && (
          <SpacingGuides bounds={selectedBounds} />
        )}
      </AnimatePresence>
      
      {/* Element measurement tooltip */}
      {selectedBounds && selectedElement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-mono pointer-events-none"
          style={{
            top: selectedBounds.top + selectedBounds.height + 10,
            left: selectedBounds.left
          }}
        >
          {Math.round(selectedBounds.width)}px × {Math.round(selectedBounds.height)}px
        </motion.div>
      )}
    </div>
  );
};

export default ElementOverlaySystem;
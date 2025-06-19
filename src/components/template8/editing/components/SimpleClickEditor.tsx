import React, { useRef, useEffect, useState } from 'react';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SimpleClickEditorProps {
  sectionData: any;
  onUpdate: (updates: any) => void;
}

const SimpleClickEditor: React.FC<SimpleClickEditorProps> = ({ sectionData, onUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [editText, setEditText] = useState('');

  // Simple click handler - no loops, no complex setup
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Only handle text elements
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'BUTTON'].includes(target.tagName)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Clear previous selection
      if (selectedElement) {
        selectedElement.style.outline = '';
      }
      
      // Select new element
      target.style.outline = '2px solid red';
      setSelectedElement(target);
      setEditText(target.textContent || '');
      
      console.log('Selected:', target.tagName, target.textContent);
    }
  };

  const handleTextChange = (newText: string) => {
    if (selectedElement) {
      selectedElement.textContent = newText;
      setEditText(newText);
      
      // Update data based on element type/content
      if (selectedElement.textContent?.includes('Welcome') || selectedElement.tagName === 'H1') {
        onUpdate({ ...sectionData, heroTitle: newText });
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Site Preview */}
      <div className="flex-1 relative">
        <div 
          ref={containerRef}
          onClick={handleContainerClick}
          className="h-full overflow-auto cursor-pointer"
        >
          <ChairLinkedRenderer 
            config={sectionData}
            logoUrl={sectionData.logoUrl}
            isProductionPreview={true}
            siteType="demo"
            readOnly={false}
          />
        </div>
        
        {/* Overlay instruction */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded text-sm">
          Click any text to edit it
        </div>
      </div>

      {/* Simple Sidebar */}
      <div className="w-80 bg-gray-800 text-white p-4">
        <h3 className="text-lg font-bold mb-4">Text Editor</h3>
        
        {selectedElement ? (
          <div>
            <p className="text-sm text-gray-300 mb-2">
              Editing: {selectedElement.tagName}
            </p>
            <Input
              value={editText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mb-4"
              placeholder="Enter text..."
            />
            <Button
              onClick={() => {
                if (selectedElement) {
                  selectedElement.style.outline = '';
                  setSelectedElement(null);
                  setEditText('');
                }
              }}
              variant="outline"
              className="w-full"
            >
              Clear Selection
            </Button>
          </div>
        ) : (
          <p className="text-gray-400">Click on any text element to edit it</p>
        )}
      </div>
    </div>
  );
};

export default SimpleClickEditor;
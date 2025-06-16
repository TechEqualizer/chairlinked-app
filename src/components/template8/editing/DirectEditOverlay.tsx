
import React, { useState } from "react";
import { Palette, Type, Image } from "lucide-react";
import ModernFloatingColorPanel from "./ModernFloatingColorPanel";
import EnhancedTextPanel from "./components/EnhancedTextPanel";
import EnhancedImagesPanel from "./components/EnhancedImagesPanel";

interface DirectEditOverlayProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

type EditMode = 'color' | 'text' | 'images' | null;

const DirectEditOverlay: React.FC<DirectEditOverlayProps> = ({ pageData, onUpdate }) => {
  const isEditMode = true; // Template 8 is always in edit mode
  const [activeEditMode, setActiveEditMode] = useState<EditMode>(null);

  const closePanel = () => {
    setActiveEditMode(null);
  };

  if (!isEditMode) return null;

  return (
    <>
      {/* Minimal Quick Action Toolbar */}
      <div 
        className="fixed top-20 right-4 z-40 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 p-2 flex flex-col gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={() => setActiveEditMode(activeEditMode === 'color' ? null : 'color')}
          className={`p-2 rounded-lg transition-all pointer-events-auto cursor-pointer ${
            activeEditMode === 'color' 
              ? 'bg-indigo-500 text-white shadow-md' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Edit Colors"
        >
          <Palette size={18} />
        </button>
        
        <button
          onClick={() => setActiveEditMode(activeEditMode === 'text' ? null : 'text')}
          className={`p-2 rounded-lg transition-all pointer-events-auto cursor-pointer ${
            activeEditMode === 'text' 
              ? 'bg-indigo-500 text-white shadow-md' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Edit Text"
        >
          <Type size={18} />
        </button>

        <button
          onClick={() => setActiveEditMode(activeEditMode === 'images' ? null : 'images')}
          className={`p-2 rounded-lg transition-all pointer-events-auto cursor-pointer ${
            activeEditMode === 'images' 
              ? 'bg-indigo-500 text-white shadow-md' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Edit Images"
        >
          <Image size={18} />
        </button>
      </div>

      {/* Enhanced Floating Panels */}
      {activeEditMode === 'color' && (
        <ModernFloatingColorPanel
          pageData={pageData}
          onUpdate={onUpdate}
          onClose={closePanel}
        />
      )}
      
      {activeEditMode === 'text' && (
        <EnhancedTextPanel
          pageData={pageData}
          onUpdate={onUpdate}
          onClose={closePanel}
        />
      )}

      {activeEditMode === 'images' && (
        <EnhancedImagesPanel
          pageData={pageData}
          onUpdate={onUpdate}
          onClose={closePanel}
        />
      )}

      {/* Subtle background overlay when panel is open */}
      {activeEditMode && (
        <div 
          className="fixed inset-0 z-30 bg-black/5"
          onClick={closePanel}
        />
      )}
    </>
  );
};

export default DirectEditOverlay;


import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface SectionManagerPanelProps {
  pageData?: any;
  onUpdate?: (updates: any) => void;
  sections?: Array<{
    id: string;
    name: string;
    component: React.ComponentType<any>;
    icon: string;
    isVisible?: boolean;
  }>;
  onReorderSections?: (sections: any[]) => void;
  onAddSection?: () => void;
  onDeleteSection?: (sectionId: string) => void;
  onToggleSectionVisibility?: (sectionId: string) => void;
}

const SectionManagerPanel: React.FC<SectionManagerPanelProps> = ({
  pageData,
  onUpdate,
  sections = [],
  onReorderSections,
  onAddSection,
  onDeleteSection,
  onToggleSectionVisibility
}) => {
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = React.useState<string | null>(null);

  const handleDragStart = (sectionId: string) => {
    setDraggedItem(sectionId);
  };

  const handleDragEnd = () => {
    if (!draggedItem || !dragOverItem || draggedItem === dragOverItem) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = sections.findIndex(section => section.id === draggedItem);
    const targetIndex = sections.findIndex(section => section.id === dragOverItem);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    onReorderSections?.(newSections);
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    setDragOverItem(sectionId);
  };

  const handleToggleVisibility = (sectionId: string) => {
    onToggleSectionVisibility?.(sectionId);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Manage Sections</h3>
        {onAddSection && (
          <button
            onClick={onAddSection}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Section
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            layout
            className={`
              p-4 bg-white border rounded-lg transition-all cursor-move
              ${draggedItem === section.id ? 'opacity-50 scale-95' : ''}
              ${dragOverItem === section.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              ${!section.isVisible ? 'opacity-60' : ''}
            `}
            draggable
            onDragStart={() => handleDragStart(section.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, section.id)}
            whileDrag={{ scale: 1.02, zIndex: 10 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-gray-400" />
                <span className="text-xl">{section.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{section.name}</div>
                  <div className="text-sm text-gray-500">
                    Position {index + 1} • {section.isVisible ? 'Visible' : 'Hidden'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {onToggleSectionVisibility && (
                  <button
                    onClick={() => handleToggleVisibility(section.id)}
                    className={`p-2 rounded-md transition-colors ${
                      section.isVisible 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={section.isVisible ? 'Hide section' : 'Show section'}
                  >
                    {section.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                )}
                
                {onDeleteSection && section.id !== 'hero' && section.id !== 'navbar' && (
                  <button
                    onClick={() => onDeleteSection(section.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove section"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No sections configured yet.</p>
          {onAddSection && (
            <button
              onClick={onAddSection}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first section
            </button>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drag sections to reorder them</li>
          <li>• Click the eye icon to show/hide sections</li>
          <li>• Use the trash icon to remove sections (except Hero and Navbar)</li>
          <li>• Changes are saved automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default SectionManagerPanel;

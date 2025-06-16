
import React from 'react';
import { Button } from '@/components/ui/button';
import { EditorSection, SectionInfo } from '@/hooks/useSectionEditor';

interface SectionNavigatorProps {
  sections: SectionInfo[];
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Sections</h3>
        <div className="grid grid-cols-2 gap-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSectionChange(section.id)}
              className="justify-start text-left h-auto p-3"
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-base">{section.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{section.name}</div>
                  <div className="text-xs opacity-70 truncate">{section.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';
import { useSectionEditor } from '@/hooks/useSectionEditor';
import { SectionNavigator } from './SectionNavigator';
import { SectionEditorRenderer } from './SectionEditorRenderer';

interface EditorFormPanelProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: string) => void;
}

export const EditorFormPanel: React.FC<EditorFormPanelProps> = ({
  data,
  onUpdateField,
}) => {
  const { activeSection, navigateToSection, sections } = useSectionEditor();

  console.log('[EditorFormPanel] Active section:', activeSection, 'Data:', data);

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      <SectionNavigator
        sections={sections}
        activeSection={activeSection}
        onSectionChange={navigateToSection}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <SectionEditorRenderer
            activeSection={activeSection}
            data={data}
            onUpdateField={onUpdateField}
          />
        </div>
      </div>
    </div>
  );
};

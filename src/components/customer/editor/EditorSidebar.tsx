
import React from 'react';
import { CustomerEditorTabs } from './CustomerEditorTabs';

interface EditorSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  editorData: any;
  onUpdate: (updates: any) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTab,
  onTabChange,
  editorData,
  onUpdate,
}) => {
  return (
    <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
       <div className="p-4 border-b border-gray-200 h-16 flex items-center">
          <h3 className="font-semibold text-lg">Content Editor</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <CustomerEditorTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
            editorData={editorData}
            onUpdate={onUpdate}
          />
        </div>
    </aside>
  );
};

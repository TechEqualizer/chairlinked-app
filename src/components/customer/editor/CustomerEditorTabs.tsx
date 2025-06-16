
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerBasicEditor } from './CustomerBasicEditor';
import { CustomerBusinessInfoEditor } from './CustomerBusinessInfoEditor';
import { CustomerVisualEditor } from './CustomerVisualEditor';
import { CustomerServicesEditor } from './CustomerServicesEditor';
import { CustomerGalleryEditor } from './CustomerGalleryEditor';
import { FileText, Briefcase, GalleryHorizontal, Phone, Palette } from 'lucide-react';

interface CustomerEditorTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  editorData: any;
  onUpdate: (updates: any) => void;
}

export const CustomerEditorTabs: React.FC<CustomerEditorTabsProps> = ({
  activeTab,
  onTabChange,
  editorData,
  onUpdate
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
      {/* Horizontal scrollable tabs for better mobile experience */}
      <TabsList className="grid w-full grid-cols-5 sticky top-0 z-10 bg-white border-b text-xs shrink-0">
        <TabsTrigger value="content" className="text-xs px-2 flex items-center justify-center gap-1.5">
          <FileText className="h-4 w-4" />
          Content
        </TabsTrigger>
        <TabsTrigger value="services" className="text-xs px-2 flex items-center justify-center gap-1.5">
          <Briefcase className="h-4 w-4" />
          Services
        </TabsTrigger>
        <TabsTrigger value="gallery" className="text-xs px-2 flex items-center justify-center gap-1.5">
          <GalleryHorizontal className="h-4 w-4" />
          Gallery
        </TabsTrigger>
        <TabsTrigger value="business" className="text-xs px-2 flex items-center justify-center gap-1.5">
          <Phone className="h-4 w-4" />
          Contact
        </TabsTrigger>
        <TabsTrigger value="design" className="text-xs px-2 flex items-center justify-center gap-1.5">
          <Palette className="h-4 w-4" />
          Design
        </TabsTrigger>
      </TabsList>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <TabsContent value="content" className="mt-0">
            <CustomerBasicEditor
              data={editorData}
              onUpdate={onUpdate}
            />
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <CustomerServicesEditor
              data={editorData}
              onUpdate={onUpdate}
            />
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-0">
            <CustomerGalleryEditor
              data={editorData}
              onUpdate={onUpdate}
            />
          </TabsContent>
          
          <TabsContent value="business" className="mt-0">
            <CustomerBusinessInfoEditor
              data={editorData}
              onUpdate={onUpdate}
            />
          </TabsContent>
          
          <TabsContent value="design" className="mt-0">
            <CustomerVisualEditor
              data={editorData}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

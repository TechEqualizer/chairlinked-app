
import React, { useState } from "react";
import { X, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImagesTab from "./textPanel/ImagesTab";
import BackgroundImageTab from "./textPanel/BackgroundImageTab";

interface EnhancedImagesPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const EnhancedImagesPanel: React.FC<EnhancedImagesPanelProps> = ({ pageData, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState("images");

  return (
    <div className="fixed top-20 right-20 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-h-[calc(100vh-6rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Image size={18} className="text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Images</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="images" className="text-xs">Hero Images</TabsTrigger>
            <TabsTrigger value="background" className="text-xs">Background</TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="images" className="mt-0">
              <ImagesTab pageData={pageData} onUpdate={onUpdate} />
            </TabsContent>

            <TabsContent value="background" className="mt-0">
              <BackgroundImageTab pageData={pageData} onUpdate={onUpdate} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedImagesPanel;

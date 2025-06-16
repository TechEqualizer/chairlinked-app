
import React, { useState } from "react";
import { X, Type } from "lucide-react";
import { motion } from "framer-motion";
import { tabs } from "./textPanel/constants";
import { TabType, EnhancedTextPanelProps } from "./textPanel/types";
import ContentTab from "./textPanel/ContentTab";
import TypographyTab from "./textPanel/TypographyTab";
import ColorsTab from "./textPanel/ColorsTab";
import StylingTab from "./textPanel/StylingTab";

const EnhancedTextPanel: React.FC<EnhancedTextPanelProps> = ({ 
  pageData, 
  onUpdate, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentTab pageData={pageData} onUpdate={onUpdate} />;
      case 'typography':
        return <TypographyTab pageData={pageData} onUpdate={onUpdate} />;
      case 'colors':
        return <ColorsTab pageData={pageData} onUpdate={onUpdate} />;
      case 'styling':
        return <StylingTab pageData={pageData} onUpdate={onUpdate} />;
      default:
        return <ContentTab pageData={pageData} onUpdate={onUpdate} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 20 }}
      className="fixed top-20 right-4 z-50 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 w-80 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-600" />
          <h3 className="font-medium text-gray-800">Text Editor</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 transition"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={12} className="mx-auto mb-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </motion.div>
  );
};

export default EnhancedTextPanel;

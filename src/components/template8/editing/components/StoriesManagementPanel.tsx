
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import StoriesEditBar from "./StoriesEditBar";

interface StoriesManagementPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  brandColor: string;
  onClose: () => void;
}

const StoriesManagementPanel: React.FC<StoriesManagementPanelProps> = ({
  pageData,
  onUpdate,
  brandColor,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Stories Management</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <StoriesEditBar
        pageData={pageData}
        onUpdate={onUpdate}
        brandColor={brandColor}
      />
    </motion.div>
  );
};

export default StoriesManagementPanel;

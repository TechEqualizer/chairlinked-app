
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StoriesHeaderPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const StoriesHeaderPanel: React.FC<StoriesHeaderPanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  const handleTitleChange = (title: string) => {
    onUpdate({ storiesTitle: title });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ storiesDescription: description });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Section Header</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Section Title</Label>
          <Input
            value={pageData.storiesTitle || "Featured Stories"}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Featured Stories"
            className="text-sm"
          />
          <p className="text-xs text-gray-500">
            {(pageData.storiesTitle || "Featured Stories").length}/50 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Section Description</Label>
          <Textarea
            value={pageData.storiesDescription || "Discover our latest work, behind-the-scenes moments, and client success stories"}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Section description..."
            className="text-sm resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            {(pageData.storiesDescription || "Discover our latest work, behind-the-scenes moments, and client success stories").length}/200 characters
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StoriesHeaderPanel;

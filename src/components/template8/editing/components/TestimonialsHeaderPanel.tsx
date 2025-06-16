
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TestimonialsHeaderPanelProps {
  title: string;
  subtitle: string;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  brandColor: string;
  onClose: () => void;
}

const TestimonialsHeaderPanel: React.FC<TestimonialsHeaderPanelProps> = ({
  title,
  subtitle,
  onTitleChange,
  onSubtitleChange,
  brandColor,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Section Content</h3>
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
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="What Our Clients Say"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Section Subtitle</Label>
          <textarea
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Don't just take our word for it..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20"
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: Keep your title concise and your subtitle descriptive to set the right expectations
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsHeaderPanel;

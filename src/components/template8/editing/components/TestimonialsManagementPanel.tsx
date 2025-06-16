
import React from "react";
import { X, Plus, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TestimonialsManagementPanelProps {
  onAddTestimonial: () => void;
  testimonialsCount: number;
  brandColor: string;
  onClose: () => void;
}

const TestimonialsManagementPanel: React.FC<TestimonialsManagementPanelProps> = ({
  onAddTestimonial,
  testimonialsCount,
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
        <h3 className="text-lg font-semibold text-gray-900">Testimonials Management</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Current Testimonials</h4>
              <p className="text-sm text-gray-500">{testimonialsCount} testimonials</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <Button
          onClick={onAddTestimonial}
          className="w-full flex items-center gap-2"
          style={{ backgroundColor: brandColor }}
        >
          <Plus size={16} />
          Add New Testimonial
        </Button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: Click on any testimonial card to edit its content, rating, or author information
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsManagementPanel;

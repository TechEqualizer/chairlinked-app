
import React from "react";
import { X, Plus, Image as ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface GalleryManagementPanelProps {
  onAddImage: (mediaType?: 'image' | 'video') => void;
  brandColor: string;
  onClose: () => void;
}

const GalleryManagementPanel: React.FC<GalleryManagementPanelProps> = ({
  onAddImage,
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
        <h3 className="text-lg font-semibold text-gray-900">Gallery Management</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Add New Media</h4>
          
          <Button
            onClick={() => onAddImage('image')}
            className="w-full flex items-center gap-2"
            style={{ backgroundColor: brandColor }}
          >
            <ImageIcon size={16} />
            Add New Image
          </Button>
          
          <Button
            onClick={() => onAddImage('video')}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Video size={16} />
            Add New Video
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: Click on any gallery item to edit its content, caption, or category
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryManagementPanel;

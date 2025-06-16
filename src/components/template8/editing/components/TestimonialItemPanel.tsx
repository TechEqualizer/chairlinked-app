
import React from "react";
import { X, Trash2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TestimonialItemPanelProps {
  testimonial: any;
  testimonialIndex: number;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
  onRatingUpdate: (rating: number) => void;
  brandColor: string;
  onClose: () => void;
}

const TestimonialItemPanel: React.FC<TestimonialItemPanelProps> = ({
  testimonial,
  testimonialIndex,
  onUpdate,
  onDelete,
  onRatingUpdate,
  brandColor,
  onClose
}) => {
  const handleRemove = () => {
    onDelete();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Edit Testimonial</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Author Name */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Author Name</Label>
          <Input
            value={testimonial.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Client name..."
            className="w-full"
          />
        </div>

        {/* Testimonial Text */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Testimonial Text</Label>
          <textarea
            value={testimonial.text}
            onChange={(e) => onUpdate('text', e.target.value)}
            placeholder="Testimonial content..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
          />
          <p className="text-xs text-gray-500">
            {testimonial.text.length}/500 characters
          </p>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Rating</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRatingUpdate(star)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Star
                  size={20}
                  className={star <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">{testimonial.rating}/5</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Location</Label>
          <Input
            value={testimonial.location || ''}
            onChange={(e) => onUpdate('location', e.target.value)}
            placeholder="City, State"
            className="w-full"
          />
        </div>

        {/* Service */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Service</Label>
          <Input
            value={testimonial.service || ''}
            onChange={(e) => onUpdate('service', e.target.value)}
            placeholder="Service provided..."
            className="w-full"
          />
        </div>

        {/* Avatar URL */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Avatar URL</Label>
          <Input
            value={testimonial.avatarUrl || ''}
            onChange={(e) => onUpdate('avatarUrl', e.target.value)}
            placeholder="https://..."
            className="w-full"
          />
        </div>

        {/* Remove Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleRemove}
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Remove Testimonial
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialItemPanel;

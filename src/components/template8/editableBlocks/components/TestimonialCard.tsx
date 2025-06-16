
import React from "react";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import EditableImage from "@/components/chairlinked/editing/EditableImage";
import { Star, Quote, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { getThemeClasses, SectionTheme } from "../../utils/themeUtils";

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  location?: string;
  service?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  sectionTheme: SectionTheme;
  brandColor: string;
  onUpdate: (index: number, field: string, value: any) => void;
  onDelete: (index: number) => void;
  onRatingUpdate: (index: number, rating: number) => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index,
  sectionTheme,
  brandColor,
  onUpdate,
  onDelete,
  onRatingUpdate
}) => {
  const themeClasses = getThemeClasses(sectionTheme);

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate(index, field, value);
  };

  const handleRatingClick = (rating: number) => {
    onRatingUpdate(index, rating);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      onDelete(index);
    }
  };

  return (
    <div
      className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 ${themeClasses.shadow} border ${themeClasses.border} ${themeClasses.cardHover} transition-all duration-300 relative group h-full flex flex-col`}
    >
      {/* Edit/Delete Actions */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <Edit size={14} className="text-gray-600" />
          <span className="text-xs text-gray-600">Edit</span>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors"
          aria-label="Delete testimonial"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Quote Icon */}
      <div className="mb-4">
        <div 
          className="inline-flex p-2 rounded-lg"
          style={{ backgroundColor: `${brandColor}15` }}
        >
          <Quote 
            size={20} 
            className="text-current"
            style={{ color: brandColor }}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleRatingClick(i + 1)}
            className="p-0.5 rounded hover:bg-gray-100 transition-colors"
          >
            <Star 
              size={16} 
              className={`fill-current cursor-pointer transition-colors ${
                i < testimonial.rating 
                  ? 'text-current' 
                  : sectionTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`}
              style={{ 
                color: i < testimonial.rating 
                  ? brandColor
                  : undefined 
              }}
            />
          </button>
        ))}
        <span className="ml-2 text-xs text-gray-500">{testimonial.rating}/5</span>
      </div>

      {/* Testimonial Text */}
      <div className="mb-6 flex-1">
        <SimpleEditableText
          value={testimonial.text}
          onChange={(value) => handleFieldUpdate('text', value)}
          className={`${themeClasses.textSecondary} leading-relaxed italic`}
          placeholder="Add testimonial text..."
        />
      </div>

      {/* Author Info */}
      <div className="flex items-center mt-auto">
        <div className="w-12 h-12 mr-4 relative">
          <EditableImage
            src={testimonial.avatarUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b789"}
            onChange={(url) => handleFieldUpdate('avatarUrl', url)}
            alt={testimonial.name}
            className="rounded-full object-cover w-full h-full"
            aspectClass="aspect-square"
          />
        </div>
        <div className="flex-1 min-w-0">
          <SimpleEditableText
            value={testimonial.name}
            onChange={(value) => handleFieldUpdate('name', value)}
            className={`font-semibold ${themeClasses.text} block`}
            placeholder="Client name..."
          />
          
          {testimonial.service && (
            <div
              className="text-sm font-medium mt-1"
              style={{ color: brandColor }}
            >
              <SimpleEditableText
                value={testimonial.service}
                onChange={(value) => handleFieldUpdate('service', value)}
                placeholder="Service provided..."
              />
            </div>
          )}
          
          {testimonial.location && (
            <SimpleEditableText
              value={testimonial.location}
              onChange={(value) => handleFieldUpdate('location', value)}
              className={`text-sm ${themeClasses.textSecondary} block`}
              placeholder="Location..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

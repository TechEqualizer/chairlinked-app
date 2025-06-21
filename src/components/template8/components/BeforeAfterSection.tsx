import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSectionProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  brandColor?: string;
  onBeforeImageChange?: (image: string) => void;
  onAfterImageChange?: (image: string) => void;
  isEditing?: boolean;
}

const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  beforeImage = '',
  afterImage = '',
  beforeLabel = 'Before',
  afterLabel = 'After',
  brandColor = '#8B5CF6',
  onBeforeImageChange,
  onAfterImageChange,
  isEditing = false
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleImageUpload = (file: File, type: 'before' | 'after') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'before' && onBeforeImageChange) {
        onBeforeImageChange(result);
      } else if (type === 'after' && onAfterImageChange) {
        onAfterImageChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (type: 'before' | 'after') => {
    if (type === 'before') {
      beforeInputRef.current?.click();
    } else {
      afterInputRef.current?.click();
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Amazing Transformation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            See the incredible results we deliver. Drag the slider to compare the before and after.
          </motion.p>
        </div>

        {/* Before/After Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl cursor-col-resize"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Before Image */}
            <div className="absolute inset-0">
              {beforeImage ? (
                <img
                  src={beforeImage}
                  alt={beforeLabel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer"
                  onClick={() => isEditing && triggerFileInput('before')}
                >
                  <div className="text-center">
                    <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 font-medium">
                      {isEditing ? 'Click to upload Before image' : 'Before Image'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* After Image with Clip Path */}
            <div 
              className="absolute inset-0"
              style={{ 
                clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)` 
              }}
            >
              {afterImage ? (
                <img
                  src={afterImage}
                  alt={afterLabel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full bg-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={() => isEditing && triggerFileInput('after')}
                >
                  <div className="text-center">
                    <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-600 font-medium">
                      {isEditing ? 'Click to upload After image' : 'After Image'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
            >
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-col-resize"
                style={{ borderColor: brandColor, borderWidth: 3 }}
              >
                <ArrowLeftRight size={20} style={{ color: brandColor }} />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {beforeLabel}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div
                className="text-white px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: brandColor }}
              >
                {afterLabel}
              </div>
            </div>

            {/* Editing Upload Overlays */}
            {isEditing && (
              <>
                {!beforeImage && (
                  <div
                    className="absolute inset-0 bg-black/10 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors"
                    style={{ clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)` }}
                    onClick={() => triggerFileInput('before')}
                  >
                    <div className="text-center">
                      <Upload size={32} className="mx-auto mb-2 text-white" />
                      <p className="text-white font-medium text-sm">Upload Before</p>
                    </div>
                  </div>
                )}
                {!afterImage && (
                  <div
                    className="absolute inset-0 bg-black/10 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors"
                    style={{ clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)` }}
                    onClick={() => triggerFileInput('after')}
                  >
                    <div className="text-center">
                      <Upload size={32} className="mx-auto mb-2 text-white" />
                      <p className="text-white font-medium text-sm">Upload After</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <ArrowLeftRight size={16} />
              Drag the slider to compare images
            </p>
          </div>
        </motion.div>

        {/* Hidden File Inputs */}
        <input
          ref={beforeInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, 'before');
          }}
        />
        <input
          ref={afterInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, 'after');
          }}
        />
      </div>
    </div>
  );
};

export default BeforeAfterSection;
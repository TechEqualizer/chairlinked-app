
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import { Quote, Star } from "lucide-react";

interface TestimonialsHeaderProps {
  title: string;
  subtitle: string;
  brandColor: string;
  fontClass: string;
  themeClasses: any;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  isEditMode?: boolean;
}

const TestimonialsHeader: React.FC<TestimonialsHeaderProps> = ({
  title,
  subtitle,
  brandColor,
  fontClass,
  themeClasses,
  onTitleChange,
  onSubtitleChange,
  isEditMode = true
}) => {
  return (
    <motion.div 
      className="mb-16 text-center relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-16 -right-16 w-32 h-32 border border-gray-200/20 rounded-full"
          style={{ borderColor: `${brandColor}15` }}
        />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${brandColor}10, ${brandColor}20, transparent)`
          }}
        />
      </div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 mb-6"
      >
        <motion.div 
          className="h-px w-12 rounded-full"
          style={{ backgroundColor: `${brandColor}60` }}
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <span className={cn(
          "text-sm font-medium tracking-wider uppercase px-3 py-1 rounded-full border flex items-center gap-2",
          fontClass
        )}
        style={{ 
          color: brandColor,
          borderColor: `${brandColor}30`,
          backgroundColor: `${brandColor}08`
        }}>
          <Star size={14} />
          Testimonials
        </span>
        <motion.div 
          className="h-px w-12 rounded-full"
          style={{ backgroundColor: `${brandColor}60` }}
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </motion.div>

      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        {isEditMode ? (
          <SimpleEditableText
            value={title}
            onChange={onTitleChange}
            tag="h2"
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent", 
              fontClass
            )}
            style={{
              backgroundImage: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 50%, ${brandColor}aa 100%)`
            }}
            placeholder="Section Title"
          />
        ) : (
          <h2
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent", 
              fontClass
            )}
            style={{
              backgroundImage: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 50%, ${brandColor}aa 100%)`
            }}
          >
            {title}
          </h2>
        )}
      </motion.div>
      
      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        {isEditMode ? (
          <SimpleEditableText
            value={subtitle}
            onChange={onSubtitleChange}
            tag="p"
            className={cn(
              "text-lg sm:text-xl leading-relaxed px-4 sm:px-0", 
              fontClass,
              themeClasses.textSecondary
            )}
            placeholder="Section description"
          />
        ) : (
          <p 
            className={cn(
              "text-lg sm:text-xl leading-relaxed px-4 sm:px-0", 
              fontClass,
              themeClasses.textSecondary
            )}
          >
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Decorative bottom accent */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-8 flex justify-center"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: brandColor }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div 
            className="h-px w-16 rounded-full"
            style={{ backgroundColor: `${brandColor}40` }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: brandColor }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialsHeader;

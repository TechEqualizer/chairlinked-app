
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  location?: string;
  service?: string;
}

interface EnhancedTestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  brandColor: string;
  fontClass: string;
  themeClasses: any;
}

const EnhancedTestimonialCard: React.FC<EnhancedTestimonialCardProps> = ({
  testimonial,
  index,
  brandColor,
  fontClass,
  themeClasses
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -8,
        scale: 1.02
      }}
      className="group relative"
    >
      {/* Main card */}
      <div 
        className={cn(
          "relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all duration-500 overflow-hidden h-full flex flex-col",
          "bg-white/90 hover:bg-white/95",
          "shadow-lg hover:shadow-2xl",
          "border-white/40 hover:border-white/60"
        )}
        style={{
          boxShadow: `0 8px 32px ${brandColor}08, 0 4px 16px rgba(0,0,0,0.05)`
        }}
      >
        {/* Background gradient effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"
          style={{
            background: `radial-gradient(circle at top right, ${brandColor}15, transparent 70%)`
          }}
        />

        {/* Quote icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Quote 
            size={40} 
            style={{ color: brandColor }}
          />
        </div>

        {/* Rating stars */}
        <div className="flex items-center mb-6 relative z-10">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: index * 0.1 + i * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                viewport={{ once: true }}
              >
                <Star
                  size={18}
                  className={`transition-colors duration-300 ${
                    i < testimonial.rating 
                      ? 'fill-current text-current' 
                      : 'text-gray-300'
                  }`}
                  style={{ 
                    color: i < testimonial.rating ? brandColor : undefined
                  }}
                />
              </motion.div>
            ))}
          </div>
          <span 
            className={cn("ml-3 text-sm font-medium", fontClass)}
            style={{ color: brandColor }}
          >
            {testimonial.rating}.0
          </span>
        </div>

        {/* Testimonial text */}
        <blockquote 
          className={cn(
            "text-lg leading-relaxed mb-8 relative z-10 flex-1",
            fontClass,
            themeClasses.text
          )}
        >
          <span className="text-2xl opacity-50 mr-1">"</span>
          {testimonial.text}
          <span className="text-2xl opacity-50 ml-1">"</span>
        </blockquote>

        {/* Service badge */}
        {testimonial.service && (
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 relative z-10"
            style={{ 
              backgroundColor: `${brandColor}08`,
              color: brandColor,
              border: `1px solid ${brandColor}20`
            }}
          >
            {testimonial.service}
          </div>
        )}

        {/* Client info */}
        <div className="flex items-center relative z-10 mt-auto">
          {/* Avatar with glow effect */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <img
                src={testimonial.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-3 shadow-lg"
                style={{ 
                  borderColor: `${brandColor}30`,
                  boxShadow: `0 4px 12px ${brandColor}20`
                }}
              />
              {/* Verified badge */}
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                <Star size={12} className="fill-current text-white" />
              </div>
            </motion.div>
          </div>

          {/* Name and location */}
          <div className="ml-4 flex-1">
            <h4 
              className={cn("font-bold text-lg", fontClass, themeClasses.text)}
            >
              {testimonial.name}
            </h4>
            {testimonial.location && (
              <p 
                className={cn("text-sm opacity-70", fontClass, themeClasses.textSecondary)}
              >
                {testimonial.location}
              </p>
            )}
          </div>
        </div>

        {/* Hover shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl overflow-hidden">
          <div 
            className="absolute -top-1/2 -left-1/2 w-full h-full rotate-12 transform-gpu"
            style={{
              background: `linear-gradient(45deg, transparent 30%, ${brandColor}05 50%, transparent 70%)`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedTestimonialCard;

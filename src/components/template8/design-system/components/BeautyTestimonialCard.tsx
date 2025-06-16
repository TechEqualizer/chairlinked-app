
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { BeautyDesignSystem, BeautyIndustryType } from '../services/BeautyDesignSystem';

interface BeautyTestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  service?: string;
  location?: string;
  avatarUrl?: string;
  industry: BeautyIndustryType;
  className?: string;
}

const BeautyTestimonialCard: React.FC<BeautyTestimonialCardProps> = ({
  name,
  text,
  rating,
  service,
  location,
  avatarUrl,
  industry,
  className = ''
}) => {
  const themeClasses = BeautyDesignSystem.getSectionThemeClasses(industry, 'testimonials');
  
  return (
    <motion.div
      className={`${themeClasses.card} relative overflow-hidden group ${className}`}
      style={{ padding: themeClasses.cardPadding }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: themeClasses.animationEasing
      }}
      whileHover={{ y: -2 }}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Quote 
          size={48} 
          style={{ color: themeClasses.primaryColor }}
        />
      </div>

      {/* Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`${
              i < rating ? 'fill-current' : ''
            }`}
            style={{ 
              color: i < rating ? themeClasses.accentColor : '#e5e7eb'
            }}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <blockquote 
        className={`${themeClasses.text} text-base leading-relaxed mb-6 relative z-10`}
        style={{ 
          fontFamily: themeClasses.secondaryFont,
          color: themeClasses.primaryColor
        }}
      >
        "{text}"
      </blockquote>

      {/* Service Badge */}
      {service && (
        <div 
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{ 
            backgroundColor: `${themeClasses.accentColor}15`,
            color: themeClasses.accentColor
          }}
        >
          {service}
        </div>
      )}

      {/* Client Info */}
      <div className="flex items-center">
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2"
              style={{ borderColor: `${themeClasses.primaryColor}20` }}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: themeClasses.primaryColor }}
            >
              {name.charAt(0)}
            </div>
          )}
          
          {/* Verified Badge */}
          <div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: themeClasses.accentColor }}
          >
            <Star size={10} className="fill-current text-white" />
          </div>
        </div>

        {/* Name and Location */}
        <div className="ml-3">
          <h4 
            className="font-semibold text-sm"
            style={{ 
              fontFamily: themeClasses.primaryFont,
              color: themeClasses.primaryColor
            }}
          >
            {name}
          </h4>
          {location && (
            <p 
              className="text-xs"
              style={{ 
                fontFamily: themeClasses.secondaryFont,
                color: themeClasses.secondaryColor
              }}
            >
              {location}
            </p>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{ 
          background: `linear-gradient(135deg, ${themeClasses.primaryColor}02, ${themeClasses.accentColor}05)`
        }}
      />
    </motion.div>
  );
};

export default BeautyTestimonialCard;

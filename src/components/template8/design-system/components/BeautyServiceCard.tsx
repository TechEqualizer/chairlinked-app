
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign } from 'lucide-react';
import { BeautyDesignSystem, BeautyIndustryType } from '../services/BeautyDesignSystem';

interface BeautyServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  rating?: number;
  imageUrl?: string;
  category?: string;
  industry: BeautyIndustryType;
  onBookClick?: () => void;
  className?: string;
}

const BeautyServiceCard: React.FC<BeautyServiceCardProps> = ({
  title,
  description,
  price,
  duration,
  rating = 5,
  imageUrl,
  category,
  industry,
  onBookClick,
  className = ''
}) => {
  const themeClasses = BeautyDesignSystem.getSectionThemeClasses(industry, 'services');
  
  return (
    <motion.div
      className={`${themeClasses.card} relative overflow-hidden group cursor-pointer ${className}`}
      style={{ padding: themeClasses.cardPadding }}
      whileHover={{ y: -4 }}
      transition={{ 
        duration: 0.3, 
        ease: themeClasses.animationEasing
      }}
    >
      {/* Service Image */}
      {imageUrl && (
        <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Category Badge */}
      {category && (
        <div 
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
          style={{ 
            backgroundColor: `${themeClasses.primaryColor}15`,
            color: themeClasses.primaryColor
          }}
        >
          {category}
        </div>
      )}

      {/* Service Title */}
      <h3 
        className={`${themeClasses.heading} text-xl mb-2`}
        style={{ 
          fontFamily: themeClasses.primaryFont,
          color: themeClasses.primaryColor
        }}
      >
        {title}
      </h3>

      {/* Service Description */}
      <p 
        className={`${themeClasses.text} text-sm mb-4 leading-relaxed`}
        style={{ 
          fontFamily: themeClasses.secondaryFont,
          color: themeClasses.secondaryColor
        }}
      >
        {description}
      </p>

      {/* Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? 'fill-current' : ''
            }`}
            style={{ 
              color: i < rating ? themeClasses.accentColor : '#e5e7eb'
            }}
          />
        ))}
        <span 
          className="ml-2 text-sm font-medium"
          style={{ color: themeClasses.primaryColor }}
        >
          {rating}.0
        </span>
      </div>

      {/* Service Details */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock size={16} style={{ color: themeClasses.accentColor }} />
            <span 
              className="text-sm font-medium"
              style={{ color: themeClasses.primaryColor }}
            >
              {duration}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign size={16} style={{ color: themeClasses.accentColor }} />
            <span 
              className="text-lg font-bold"
              style={{ color: themeClasses.primaryColor }}
            >
              {price}
            </span>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <motion.button
        onClick={onBookClick}
        className={`${themeClasses.button} w-full py-3 px-6 text-white font-semibold rounded-lg transition-all duration-300`}
        style={{ 
          backgroundColor: themeClasses.primaryColor,
          fontFamily: themeClasses.secondaryFont
        }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: themeClasses.accentColor
        }}
        whileTap={{ scale: 0.98 }}
      >
        Book Now
      </motion.button>

      {/* Hover Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{ 
          background: `linear-gradient(135deg, ${themeClasses.primaryColor}05, ${themeClasses.accentColor}10)`
        }}
      />
    </motion.div>
  );
};

export default BeautyServiceCard;

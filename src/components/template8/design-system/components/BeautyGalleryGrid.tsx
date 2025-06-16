
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Share2, Filter } from 'lucide-react';
import { BeautyDesignSystem, BeautyIndustryType } from '../services/BeautyDesignSystem';

interface BeautyGalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  likes: number;
  views: number;
  isBeforeAfter?: boolean;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

interface BeautyGalleryGridProps {
  items: BeautyGalleryItem[];
  industry: BeautyIndustryType;
  categories?: string[];
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
  onItemClick?: (item: BeautyGalleryItem) => void;
  className?: string;
}

const BeautyGalleryGrid: React.FC<BeautyGalleryGridProps> = ({
  items,
  industry,
  categories = [],
  showFilters = true,
  columns = 3,
  onItemClick,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const themeClasses = BeautyDesignSystem.getSectionThemeClasses(industry, 'gallery');

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const allCategories = ['All', ...categories];

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(itemId)) {
        newLiked.delete(itemId);
      } else {
        newLiked.add(itemId);
      }
      return newLiked;
    });
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`beauty-gallery ${className}`}>
      {/* Category Filters */}
      {showFilters && allCategories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {allCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border"
              style={{
                backgroundColor: activeCategory === category ? themeClasses.primaryColor : 'transparent',
                color: activeCategory === category ? 'white' : themeClasses.primaryColor,
                borderColor: themeClasses.primaryColor,
                fontFamily: themeClasses.secondaryFont
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} className="inline mr-2" />
              {category}
            </motion.button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className={`grid ${gridCols[columns]} gap-6`}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <GalleryItem
              key={item.id}
              item={item}
              index={index}
              themeClasses={themeClasses}
              isLiked={likedItems.has(item.id)}
              onLike={() => handleLike(item.id)}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface GalleryItemProps {
  item: BeautyGalleryItem;
  index: number;
  themeClasses: Record<string, string>;
  isLiked: boolean;
  onLike: () => void;
  onClick?: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  item,
  index,
  themeClasses,
  isLiked,
  onLike,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBefore, setShowBefore] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1,
        ease: themeClasses.animationEasing
      }}
      className={`${themeClasses.item} group cursor-pointer overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Main Image or Before/After */}
        {item.isBeforeAfter && item.beforeImageUrl && item.afterImageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={showBefore ? item.beforeImageUrl : item.afterImageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            
            {/* Before/After Toggle */}
            <div className="absolute bottom-4 left-4 flex bg-black/50 rounded-full overflow-hidden">
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  showBefore ? 'bg-white text-black' : 'text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBefore(true);
                }}
              >
                Before
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  !showBefore ? 'bg-white text-black' : 'text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBefore(false);
                }}
              >
                After
              </button>
            </div>
          </div>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Category Badge */}
        <div 
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${themeClasses.primaryColor}90`,
            color: 'white'
          }}
        >
          {item.category}
        </div>

        {/* Overlay with Actions */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex space-x-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                size={20} 
                className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>
            
            <motion.button
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye size={20} className="text-white" />
            </motion.button>
            
            <motion.button
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={20} className="text-white" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Item Info */}
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-2 line-clamp-1"
          style={{ 
            fontFamily: themeClasses.primaryFont,
            color: themeClasses.primaryColor
          }}
        >
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart size={14} style={{ color: themeClasses.accentColor }} />
              <span style={{ color: themeClasses.secondaryColor }}>
                {item.likes + (isLiked ? 1 : 0)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={14} style={{ color: themeClasses.accentColor }} />
              <span style={{ color: themeClasses.secondaryColor }}>
                {item.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BeautyGalleryGrid;

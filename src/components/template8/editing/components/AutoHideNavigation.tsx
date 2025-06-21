import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AutoHideNavigationProps {
  children: React.ReactNode;
  position: 'top' | 'bottom';
  hideDelay?: number;
  className?: string;
}

const AutoHideNavigation: React.FC<AutoHideNavigationProps> = ({
  children,
  position,
  hideDelay = 3000,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track mouse movement to show navigation
  useEffect(() => {
    const handleMouseMove = () => {
      setLastActivity(Date.now());
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleKeyPress = () => {
      setLastActivity(Date.now());
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isVisible]);

  // Auto-hide after delay
  useEffect(() => {
    if (isHovered) return;

    const timer = setTimeout(() => {
      if (Date.now() - lastActivity >= hideDelay) {
        setIsVisible(false);
      }
    }, hideDelay);

    return () => clearTimeout(timer);
  }, [lastActivity, hideDelay, isHovered]);

  const variants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hidden: {
      y: position === 'top' ? -50 : 50,
      opacity: 0.3,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      className={`${className} relative`}
      variants={variants}
      animate={isVisible ? 'visible' : 'hidden'}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsVisible(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Show/Hide Indicator */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} left-1/2 transform -translate-x-1/2 ${position === 'top' ? 'mt-1' : 'mb-1'}`}
          >
            <button
              onClick={() => setIsVisible(true)}
              className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-full p-1 shadow-sm hover:bg-white/90 transition-all"
            >
              {position === 'top' ? (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronUp className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AutoHideNavigation;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SwipeTransitionProps {
  children: React.ReactNode;
  direction: 'left' | 'right' | null;
}

const SwipeTransition: React.FC<SwipeTransitionProps> = ({ children, direction }) => {
  return (
    <motion.div
      className="w-full h-full"
      animate={{
        x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0,
        opacity: direction ? 0 : 1
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default SwipeTransition;


import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  brandColor: string;
  navbarBackgroundColor: string;
  ctaText: string;
  onNavClick: (href: string) => void;
  onCtaClick: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  brandColor,
  navbarBackgroundColor,
  ctaText,
  onNavClick,
  onCtaClick,
  onClose
}) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-100/30 backdrop-blur-xl"
            style={{ backgroundColor: `${navbarBackgroundColor}f8` }}
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => onNavClick(item.href)}
                  className="block w-full text-left text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:bg-gray-50/80"
                  style={{ color: brandColor }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              <motion.button
                onClick={onCtaClick}
                className="w-full mt-6 px-8 py-4 font-semibold text-white rounded-2xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)`,
                  boxShadow: `0 4px 20px ${brandColor}40`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tracking-wide">{ctaText}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;


import React from "react";
import { motion } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
}

interface DesktopNavigationProps {
  navItems: NavItem[];
  brandColor: string;
  onNavClick: (href: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  brandColor,
  onNavClick
}) => {
  return (
    <nav className="hidden md:flex items-center space-x-10">
      {navItems.map((item, index) => (
        <motion.button
          key={item.name}
          onClick={() => onNavClick(item.href)}
          className="relative font-medium text-base tracking-wide transition-all duration-300 py-2 px-1 hover:opacity-80"
          style={{ color: brandColor }}
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="relative z-10">{item.name}</span>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full origin-left"
            style={{ backgroundColor: brandColor }}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      ))}
    </nav>
  );
};

export default DesktopNavigation;

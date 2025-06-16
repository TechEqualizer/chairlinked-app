
import React from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  brandColor: string;
  onToggle: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  brandColor,
  onToggle
}) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-3 rounded-xl transition-all duration-300 hover:bg-gray-100/80"
      style={{ color: brandColor }}
      aria-label="Menu"
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.div>
    </button>
  );
};

export default MobileMenuButton;

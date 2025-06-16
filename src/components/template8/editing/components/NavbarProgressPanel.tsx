
import React from "react";
import { motion } from "framer-motion";
import ProgressCard from "./navbar/ProgressCard";
import QuickTipsCard from "./navbar/QuickTipsCard";

interface NavbarProgressPanelProps {
  pageData: any;
}

const NavbarProgressPanel: React.FC<NavbarProgressPanelProps> = ({
  pageData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="text-center lg:text-left">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Editing Navigation
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customize Your Navigation
        </h2>
        <p className="text-gray-600 mb-6">
          Create a professional navigation that reflects your brand identity. Use the toolbar on the right to edit specific elements.
        </p>
      </div>
      
      <ProgressCard pageData={pageData} />
      <QuickTipsCard />
    </motion.div>
  );
};

export default NavbarProgressPanel;

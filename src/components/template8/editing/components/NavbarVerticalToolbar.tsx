
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Palette } from "lucide-react";
import EnhancedVerticalToolbar from "./toolbar/EnhancedVerticalToolbar";
import NavbarIdentityPanel from "./NavbarIdentityPanel";
import NavbarBrandPanel from "./NavbarBrandPanel";

interface NavbarVerticalToolbarProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  brandColor?: string;
}

const NavbarVerticalToolbar: React.FC<NavbarVerticalToolbarProps> = ({
  pageData,
  onUpdate,
  brandColor = "#8B5CF6"
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const availablePanels = [
    {
      id: "identity",
      icon: <User size={18} />,
      title: "Primary Identity"
    },
    {
      id: "brand",
      icon: <Palette size={18} />,
      title: "Brand Colors"
    }
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case "identity":
        return (
          <NavbarIdentityPanel
            pageData={pageData}
            onUpdate={onUpdate}
            onClose={() => setActivePanel(null)}
          />
        );
      case "brand":
        return (
          <NavbarBrandPanel
            pageData={pageData}
            onUpdate={onUpdate}
            onClose={() => setActivePanel(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <EnhancedVerticalToolbar
        brandColor={brandColor}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        availablePanels={availablePanels}
        currentSection="Navigation"
      />

      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-96 bg-white/98 backdrop-blur-xl shadow-2xl border-l border-gray-200 z-[60] overflow-y-auto" // Increased z-index and width
            style={{ marginRight: '96px' }} // Increased margin to avoid overlap
          >
            {renderPanel()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background overlay when panel is open - higher z-index */}
      {activePanel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[50] bg-black/20 backdrop-blur-sm"
          onClick={() => setActivePanel(null)}
        />
      )}
    </>
  );
};

export default NavbarVerticalToolbar;

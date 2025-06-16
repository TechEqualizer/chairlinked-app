
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight } from "lucide-react";
import { editingSections } from "../config/editingSections";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionIndex: number) => void;
  currentSectionIndex: number;
}

const ModernCommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateToSection,
  currentSectionIndex
}) => {
  const [query, setQuery] = useState("");

  const commands = [
    ...editingSections.map((section, index) => ({
      id: `section-${index}`,
      title: `Go to ${section.name}`,
      subtitle: section.name,
      icon: section.icon,
      action: () => onNavigateToSection(index),
      category: 'Navigation'
    })),
    {
      id: 'save',
      title: 'Save Changes',
      subtitle: 'Save your work',
      icon: '💾',
      action: () => {},
      category: 'Actions'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />
          
          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-[100]"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mx-4">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-lg placeholder-gray-400 outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Command size={12} />
                  <span>K</span>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  <div className="p-2">
                    {filteredCommands.map((command, index) => (
                      <motion.button
                        key={command.id}
                        onClick={() => {
                          command.action();
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                          <span className="text-sm">{command.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{command.title}</div>
                          <div className="text-sm text-gray-500">{command.subtitle}</div>
                        </div>
                        <ArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-medium">No commands found</div>
                    <div className="text-sm">Try searching for something else</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
                <div>Navigate with ↑↓ • Select with ↵</div>
                <div>Press ESC to close</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModernCommandPalette;

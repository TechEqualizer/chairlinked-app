
import React from "react";
import { motion } from "framer-motion";
import { Save, Undo2, Redo2, Eye, Settings, Command } from "lucide-react";

interface ToolbarItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary';
  shortcut: string;
}

interface ModernFloatingToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onSettings: () => void;
  onCommandPalette: () => void;
  isSaving?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  brandColor?: string;
}

const ModernFloatingToolbar: React.FC<ModernFloatingToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onPreview,
  onSettings,
  onCommandPalette,
  isSaving = false,
  canUndo = false,
  canRedo = false,
  brandColor = "#0ea5e9"
}) => {
  const toolbarItems: ToolbarItem[] = [
    {
      id: 'save',
      icon: Save,
      label: 'Save',
      onClick: onSave,
      disabled: isSaving,
      variant: 'primary' as const,
      shortcut: '⌘S'
    },
    {
      id: 'undo',
      icon: Undo2,
      label: 'Undo',
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: '⌘Z'
    },
    {
      id: 'redo',
      icon: Redo2,
      label: 'Redo',
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: '⌘⇧Z'
    },
    {
      id: 'preview',
      icon: Eye,
      label: 'Preview',
      onClick: onPreview,
      shortcut: '⌘P'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      onClick: onSettings,
      shortcut: '⌘,'
    },
    {
      id: 'command',
      icon: Command,
      label: 'Command Palette',
      onClick: onCommandPalette,
      shortcut: '⌘K'
    }
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[70]"
    >
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl p-2 flex items-center gap-1">
        {toolbarItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index === 3 && <div className="w-px h-8 bg-gray-200 mx-1" />}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.onClick}
              disabled={item.disabled}
              className={`
                group relative p-3 rounded-xl transition-all duration-200 
                ${item.variant === 'primary' 
                  ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl` 
                  : item.disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              title={`${item.label} ${item.shortcut}`}
            >
              <item.icon size={18} className={isSaving && item.id === 'save' ? 'animate-spin' : ''} />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label} <span className="text-gray-400">{item.shortcut}</span>
              </div>
            </motion.button>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default ModernFloatingToolbar;


import React from "react";
import { motion } from "framer-motion";
import { Save, Undo2, Redo2, Eye, Settings, Command, Edit3, MessageSquare } from "lucide-react";
import SaveStatusToolbar from "./SaveStatusToolbar";
import type { AutoSaveState } from '../hooks/useUnifiedAutoSave';

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
  onQuickEdit?: () => void;
  onAIChat?: () => void;
  isSaving?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  brandColor?: string;
  // Enhanced save system props
  autoSaveState?: AutoSaveState;
  onPauseAutoSave?: () => void;
  onResumeAutoSave?: () => void;
  isAutoSavePaused?: boolean;
}

const ModernFloatingToolbar: React.FC<ModernFloatingToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onPreview,
  onSettings,
  onCommandPalette,
  onQuickEdit,
  onAIChat,
  isSaving = false,
  canUndo = false,
  canRedo = false,
  brandColor = "#0ea5e9",
  autoSaveState,
  onPauseAutoSave,
  onResumeAutoSave,
  isAutoSavePaused = false
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

  // Add AI Chat button if onAIChat is provided
  if (onAIChat) {
    toolbarItems.push({
      id: 'aiChat',
      icon: MessageSquare,
      label: 'AI Assistant',
      onClick: onAIChat,
      shortcut: '⌘J'
    });
  }

  // Add Quick Edit button only if onQuickEdit is provided
  if (onQuickEdit) {
    toolbarItems.push({
      id: 'quickEdit',
      icon: Edit3,
      label: 'Quick Editor',
      onClick: onQuickEdit,
      shortcut: '⌘E'
    });
  }

  const finalToolbarItems = toolbarItems;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-[70]"
    >
      <div className="flex items-center gap-3">
        {/* Enhanced Save Status */}
        {autoSaveState && (
          <SaveStatusToolbar
            autoSaveState={autoSaveState}
            onManualSave={onSave}
            onPauseAutoSave={onPauseAutoSave || (() => {})}
            onResumeAutoSave={onResumeAutoSave || (() => {})}
            isAutoSavePaused={isAutoSavePaused}
          />
        )}

        {/* Main Toolbar */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/30 rounded-2xl shadow-lg p-1.5 flex items-center gap-0.5">
          {finalToolbarItems.map((item, index) => {
            const showSeparatorBefore = index === 3;
            const showSeparatorAfter = (onAIChat || onQuickEdit) && index >= 6 && index === finalToolbarItems.length - (onQuickEdit ? 1 : 0);
            
            return (
              <div key={item.id} className="flex items-center">
                {showSeparatorBefore && <div className="w-px h-6 bg-gray-200 mx-1" />}
                {showSeparatorAfter && <div className="w-px h-6 bg-gray-200 mx-1" />}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  data-save-button={item.id === 'save' ? 'true' : undefined}
                  className={`
                    group relative p-2 rounded-xl transition-all duration-200 
                    ${item.variant === 'primary' 
                      ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg` 
                      : item.disabled 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  title={`${item.label} ${item.shortcut}`}
                >
                  <item.icon size={16} className={isSaving && item.id === 'save' ? 'animate-spin' : ''} />
                  
                  {/* Compact Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label} <span className="text-gray-400 text-xs">{item.shortcut}</span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ModernFloatingToolbar;

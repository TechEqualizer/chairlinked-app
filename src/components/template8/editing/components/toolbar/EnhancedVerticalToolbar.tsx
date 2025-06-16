
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { enhancedDesignTokens } from "../../design-system/enhancedTokens";

interface EnhancedVerticalToolbarProps {
  // Panel management
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
  availablePanels: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
  }>;
  
  // Navigation
  currentSection?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  
  // Validation
  hasErrors?: boolean;
  brandColor?: string;
}

const EnhancedVerticalToolbar: React.FC<EnhancedVerticalToolbarProps> = ({
  activePanel,
  onPanelChange,
  availablePanels = [],
  currentSection = "Section",
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = true,
  hasErrors = false,
  brandColor = "#8B5CF6"
}) => {
  const togglePanel = (panel: string) => {
    onPanelChange(activePanel === panel ? null : panel);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 flex flex-col min-w-[64px]"
      style={{ 
        top: enhancedDesignTokens.spacing['32'], // Increased from '16' to '32' (128px) for proper clearance
        right: enhancedDesignTokens.spacing['6'],
        zIndex: enhancedDesignTokens.zIndex.popover,
        padding: enhancedDesignTokens.spacing['3'],
        gap: enhancedDesignTokens.spacing['3'],
        pointerEvents: 'auto'
      }}
    >
      {/* Navigation Controls */}
      {(onPrevious || onNext) && (
        <>
          <div className="flex flex-col" style={{ gap: enhancedDesignTokens.spacing['2'] }}>
            {onPrevious && (
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={`rounded-xl transition-all pointer-events-auto cursor-pointer ${
                  canGoPrevious 
                    ? 'hover:bg-gray-100 text-gray-600 hover:shadow-md' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                style={{ 
                  padding: enhancedDesignTokens.spacing['3'],
                  minHeight: enhancedDesignTokens.touchTarget.minimum
                }}
                title="Previous section"
              >
                <ChevronLeft size={enhancedDesignTokens.icons.lg} />
              </button>
            )}
            
            {onNext && (
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`rounded-xl transition-all pointer-events-auto cursor-pointer ${
                  canGoNext 
                    ? 'hover:bg-gray-100 text-gray-600 hover:shadow-md' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                style={{ 
                  padding: enhancedDesignTokens.spacing['3'],
                  minHeight: enhancedDesignTokens.touchTarget.minimum
                }}
                title="Next section"
              >
                <ChevronRight size={enhancedDesignTokens.icons.lg} />
              </button>
            )}
          </div>
          
          {/* Separator */}
          <div 
            className="bg-gray-200"
            style={{ 
              height: '1px',
              marginLeft: enhancedDesignTokens.spacing['2'],
              marginRight: enhancedDesignTokens.spacing['2']
            }}
          />
        </>
      )}

      {/* Panel Controls */}
      {availablePanels.map((panel) => (
        <button
          key={panel.id}
          onClick={() => togglePanel(panel.id)}
          className={`rounded-xl transition-all pointer-events-auto cursor-pointer group relative ${
            activePanel === panel.id 
              ? 'bg-indigo-500 text-white shadow-lg transform scale-105' 
              : 'hover:bg-gray-100 text-gray-600 hover:shadow-md'
          }`}
          style={{ 
            padding: enhancedDesignTokens.spacing['3'],
            minHeight: enhancedDesignTokens.touchTarget.minimum,
            minWidth: enhancedDesignTokens.touchTarget.minimum
          }}
          title={panel.title}
        >
          <div style={{ fontSize: `${enhancedDesignTokens.icons.lg}px` }}>
            {panel.icon}
          </div>
          
          {/* Active indicator */}
          {activePanel === panel.id && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 bg-indigo-500 rounded-xl -z-10"
              initial={false}
            />
          )}
        </button>
      ))}

      {/* Status Indicators */}
      {currentSection && (
        <div 
          className="bg-gray-50 rounded-xl border border-gray-100"
          style={{ 
            padding: `${enhancedDesignTokens.spacing['2']} ${enhancedDesignTokens.spacing['3']}`,
            marginTop: enhancedDesignTokens.spacing['2']
          }}
        >
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {currentSection}
          </Badge>
        </div>
      )}

      {hasErrors && (
        <div 
          className="bg-red-50 rounded-xl border border-red-100"
          style={{ 
            padding: `${enhancedDesignTokens.spacing['2']} ${enhancedDesignTokens.spacing['3']}`,
            marginTop: enhancedDesignTokens.spacing['1']
          }}
        >
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle size={enhancedDesignTokens.icons.xs} className="mr-1" />
            Errors
          </Badge>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedVerticalToolbar;

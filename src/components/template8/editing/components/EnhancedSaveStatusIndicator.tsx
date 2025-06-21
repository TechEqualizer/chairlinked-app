import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Check, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Loader2,
  AlertTriangle 
} from 'lucide-react';
import type { AutoSaveState } from '../hooks/useUnifiedAutoSave';

interface EnhancedSaveStatusIndicatorProps {
  autoSaveState: AutoSaveState;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  showDetails?: boolean;
  className?: string;
}

const EnhancedSaveStatusIndicator: React.FC<EnhancedSaveStatusIndicatorProps> = ({
  autoSaveState,
  position = 'top-right',
  showDetails = false,
  className = ''
}) => {
  const { status, lastSaved, error, saveCount, unsavedChanges } = autoSaveState;

  // Position classes
  const positionClasses = {
    'top-left': 'fixed top-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  // Status configurations
  const statusConfig = {
    idle: {
      icon: unsavedChanges ? Clock : Check,
      color: unsavedChanges ? 'text-amber-600' : 'text-green-600',
      bgColor: unsavedChanges ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200',
      message: unsavedChanges ? 'Unsaved changes' : 'All changes saved',
      pulse: unsavedChanges
    },
    saving: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      message: 'Saving changes...',
      pulse: false,
      animate: true
    },
    saved: {
      icon: Check,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      message: 'Saved successfully',
      pulse: false
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      message: error || 'Save failed',
      pulse: true
    },
    conflict: {
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      message: 'Sync conflict detected',
      pulse: true
    }
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  // Format last saved time
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Don't show for idle state without unsaved changes unless showing details
  if (status === 'idle' && !unsavedChanges && !showDetails) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        className={`${positionClasses[position]} z-[80] pointer-events-none ${className}`}
      >
        <div 
          className={`
            ${config.bgColor} backdrop-blur-md border rounded-xl shadow-sm 
            flex items-center gap-2 px-3 py-2 min-w-max
            ${config.pulse ? 'animate-pulse' : ''}
          `}
        >
          <IconComponent 
            size={16} 
            className={`${config.color} ${config.animate ? 'animate-spin' : ''}`} 
          />
          
          <div className="flex flex-col gap-0.5">
            <span className={`text-sm font-medium ${config.color}`}>
              {config.message}
            </span>
            
            {showDetails && (
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {lastSaved && (
                  <span>Last saved: {formatLastSaved(lastSaved)}</span>
                )}
                {saveCount > 0 && (
                  <span>Saves: {saveCount}</span>
                )}
                {navigator.onLine ? (
                  <Wifi size={12} className="text-green-500" />
                ) : (
                  <WifiOff size={12} className="text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedSaveStatusIndicator;
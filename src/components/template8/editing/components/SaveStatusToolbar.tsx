import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Check, 
  AlertCircle, 
  Clock, 
  Loader2,
  ChevronDown,
  History,
  Pause,
  Play
} from 'lucide-react';
import type { AutoSaveState } from '../hooks/useUnifiedAutoSave';

interface SaveStatusToolbarProps {
  autoSaveState: AutoSaveState;
  onManualSave: () => void;
  onPauseAutoSave: () => void;
  onResumeAutoSave: () => void;
  isAutoSavePaused?: boolean;
  className?: string;
}

const SaveStatusToolbar: React.FC<SaveStatusToolbarProps> = ({
  autoSaveState,
  onManualSave,
  onPauseAutoSave,
  onResumeAutoSave,
  isAutoSavePaused = false,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { status, lastSaved, error, saveCount, unsavedChanges } = autoSaveState;

  // Status configurations
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          message: 'Saving...',
          animate: true
        };
      case 'saved':
        return {
          icon: Check,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          message: 'Saved',
          animate: false
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          message: 'Failed',
          animate: false
        };
      default:
        return {
          icon: unsavedChanges ? Clock : Check,
          color: unsavedChanges ? 'text-amber-600' : 'text-gray-600',
          bgColor: unsavedChanges ? 'bg-amber-50' : 'bg-gray-50',
          message: unsavedChanges ? 'Unsaved' : 'Saved',
          animate: false
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Status Button */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
          ${config.bgColor} border border-gray-200/50 hover:border-gray-300/50
          shadow-sm hover:shadow-md
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <IconComponent 
          size={16} 
          className={`${config.color} ${config.animate ? 'animate-spin' : ''}`} 
        />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.message}
        </span>
        {unsavedChanges && (
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      {/* Expanded Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-[100] min-w-80"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Save Status</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Status Details */}
              <div className="space-y-3">
                {/* Current Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <div className="flex items-center gap-2">
                    <IconComponent 
                      size={14} 
                      className={`${config.color} ${config.animate ? 'animate-spin' : ''}`} 
                    />
                    <span className={`text-sm font-medium ${config.color}`}>
                      {config.message}
                    </span>
                  </div>
                </div>

                {/* Last Saved */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Saved:</span>
                  <span className="text-sm text-gray-900">
                    {formatLastSaved(lastSaved)}
                  </span>
                </div>

                {/* Save Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Saves:</span>
                  <span className="text-sm text-gray-900">{saveCount}</span>
                </div>

                {/* Auto-save Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto-save:</span>
                  <div className="flex items-center gap-2">
                    {isAutoSavePaused ? (
                      <Pause size={14} className="text-orange-500" />
                    ) : (
                      <Play size={14} className="text-green-500" />
                    )}
                    <span className="text-sm text-gray-900">
                      {isAutoSavePaused ? 'Paused' : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    onManualSave();
                    setShowDetails(false);
                  }}
                  disabled={status === 'saving'}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Save size={14} />
                  Save Now
                </button>

                <button
                  onClick={isAutoSavePaused ? onResumeAutoSave : onPauseAutoSave}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {isAutoSavePaused ? (
                    <>
                      <Play size={14} />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={14} />
                      Pause
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    // TODO: Implement save history
                    console.log('Show save history');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <History size={14} />
                  History
                </button>
              </div>

              {/* Tips */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  💡 Auto-save runs every 15 seconds when changes are detected
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaveStatusToolbar;
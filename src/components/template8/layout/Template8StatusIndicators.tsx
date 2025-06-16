
import React from "react";

interface Template8StatusIndicatorsProps {
  isSaving: boolean;
  isAutoSaving: boolean;
  hasRecoveredSession: boolean;
  isChairLinkedMode: boolean;
  isProductionPreview: boolean;
}

export const Template8StatusIndicators: React.FC<Template8StatusIndicatorsProps> = ({
  isSaving,
  isAutoSaving,
  hasRecoveredSession,
  isChairLinkedMode,
  isProductionPreview
}) => {
  return (
    <>
      {/* Auto-save indicator - hide in production preview */}
      {(isSaving || isAutoSaving) && !isProductionPreview && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">{isAutoSaving ? 'Auto-saving...' : 'Saving...'}</span>
          </div>
        </div>
      )}

      {/* Session recovered indicator - hide in production preview */}
      {hasRecoveredSession && !isChairLinkedMode && !isProductionPreview && (
        <div className="fixed top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Session restored</span>
          </div>
        </div>
      )}
    </>
  );
};

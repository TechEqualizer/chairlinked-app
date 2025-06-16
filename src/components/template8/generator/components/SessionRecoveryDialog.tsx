
import React from 'react';

interface SessionRecoveryDialogProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const SessionRecoveryDialog: React.FC<SessionRecoveryDialogProps> = ({
  isVisible,
  onDismiss
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-2">Session Restored</h3>
        <p className="text-gray-600 mb-4">
          Your previous editing session has been recovered. You can continue where you left off.
        </p>
        <button
          onClick={onDismiss}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Continue Editing
        </button>
      </div>
    </div>
  );
};

export default SessionRecoveryDialog;

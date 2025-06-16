
import React from "react";

interface Template8LoadingStateProps {
  hasRecoveredSession: boolean;
}

export const Template8LoadingState: React.FC<Template8LoadingStateProps> = ({
  hasRecoveredSession
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your site...</p>
        {hasRecoveredSession && (
          <p className="text-sm text-green-600 mt-2">Restoring previous session...</p>
        )}
      </div>
    </div>
  );
};

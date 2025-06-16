
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorLoadingProps {
  claimedSiteLoading: boolean;
  dataLoading: boolean;
}

export const EditorLoading: React.FC<EditorLoadingProps> = ({ claimedSiteLoading, dataLoading }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show troubleshooting options after 10 seconds
    if (timeElapsed > 10) {
      setShowTroubleshooting(true);
    }

    return () => clearInterval(timer);
  }, [timeElapsed]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
        <h2 className="text-xl font-semibold mb-2">Loading your content editor...</h2>
        
        {claimedSiteLoading && (
          <p className="text-sm text-gray-600 mb-2">Finding your site...</p>
        )}
        {dataLoading && (
          <p className="text-sm text-gray-600 mb-2">Loading site data...</p>
        )}
        
        <p className="text-xs text-gray-500 mb-4">
          Time elapsed: {timeElapsed}s
        </p>

        {showTroubleshooting && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">Taking longer than expected?</p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Refresh Page
              </Button>
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

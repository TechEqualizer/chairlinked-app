
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImprovedEditorLoadingProps {
  claimedSiteLoading: boolean;
  dataLoading: boolean;
}

export const ImprovedEditorLoading: React.FC<ImprovedEditorLoadingProps> = ({ 
  claimedSiteLoading, 
  dataLoading 
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show advanced options after 8 seconds instead of 10
    if (timeElapsed >= 8) {
      setShowAdvancedOptions(true);
    }

    return () => clearInterval(timer);
  }, [timeElapsed]);

  const handleHardRefresh = () => {
    // Clear all caches and force a hard refresh
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = window.location.href + '?refresh=' + Date.now();
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleOpenInNewTab = () => {
    window.open('/dashboard/content-editor', '_blank');
  };

  const getLoadingMessage = () => {
    if (timeElapsed < 3) return "Initializing content editor...";
    if (timeElapsed < 6) return "Finding your site...";
    if (timeElapsed < 10) return "Loading site data...";
    return "This is taking longer than expected...";
  };

  const getProgressWidth = () => {
    const progress = Math.min((timeElapsed / 10) * 100, 90); // Cap at 90% until actually loaded
    return `${progress}%`;
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg mx-auto p-8">
        <Card className="p-8">
          <CardContent className="space-y-6">
            {/* Loading Animation */}
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: getProgressWidth() }}
              />
            </div>

            {/* Dynamic Loading Message */}
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                {getLoadingMessage()}
              </h2>
              
              <div className="space-y-1 text-sm text-gray-600">
                {claimedSiteLoading && (
                  <p className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Locating your website
                  </p>
                )}
                {dataLoading && (
                  <p className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Loading content data
                  </p>
                )}
              </div>
            </div>

            {/* Timer */}
            <p className="text-xs text-gray-500">
              Time elapsed: {timeElapsed}s
            </p>

            {/* Quick Actions (show after 5 seconds) */}
            {timeElapsed >= 5 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Loading is taking longer than usual</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={handleHardRefresh}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Hard Refresh
                  </Button>
                  
                  <Button
                    onClick={handleOpenInNewTab}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}

            {/* Advanced Options (show after 8 seconds) */}
            {showAdvancedOptions && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">
                    Something seems to be stuck
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-yellow-700 mb-3">
                    If this continues, try these options:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleBackToDashboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-white"
                    >
                      <Home className="w-4 h-4" />
                      Back to Dashboard
                    </Button>
                    
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-white"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Simple Refresh
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>This usually takes 3-5 seconds</p>
              {timeElapsed > 10 && (
                <p className="text-orange-600 font-medium">
                  Consider refreshing the page or checking your connection
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EditorErrorBoundaryProps {
  error: Error;
  onRetry: () => void;
  onGoHome: () => void;
}

export const EditorErrorBoundary: React.FC<EditorErrorBoundaryProps> = ({
  error,
  onRetry,
  onGoHome
}) => {
  const handleClearCacheAndRetry = () => {
    // Clear all local storage and caches
    localStorage.clear();
    sessionStorage.clear();
    onRetry();
  };

  const handleReportIssue = () => {
    const issueBody = encodeURIComponent(`
Editor Loading Issue Report:
- Error: ${error.message}
- Stack: ${error.stack}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
- Timestamp: ${new Date().toISOString()}
    `);
    
    window.open(`mailto:support@example.com?subject=Content Editor Issue&body=${issueBody}`, '_blank');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Content Editor Error
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We encountered an issue loading your content editor. This usually resolves with a refresh.
              </p>
              
              <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
                <code>{error.message}</code>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={onRetry}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                
                <Button
                  onClick={handleClearCacheAndRetry}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Cache & Retry
                </Button>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={onGoHome}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </Button>
                
                <Button
                  onClick={handleReportIssue}
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center gap-2 text-gray-600"
                >
                  <Bug className="w-4 h-4" />
                  Report This Issue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

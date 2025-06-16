
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EditorErrorProps {
  loadError: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export const EditorError: React.FC<EditorErrorProps> = ({ loadError, onRetry, isRetrying }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex-1 overflow-auto">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Loading Error</h3>
            <p className="text-gray-600 mb-4">{loadError}</p>
            <Button onClick={onRetry} disabled={isRetrying}>
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

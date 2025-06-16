
import React, { useState } from 'react';
import { Button } from '@/components/template8/design-system/components/Button';
import { Card, CardContent } from '@/components/template8/design-system/components/Card';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';

interface SessionDebugPanelProps {
  getSessionDebugInfo: () => any;
}

const SessionDebugPanel: React.FC<SessionDebugPanelProps> = ({ getSessionDebugInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleToggle = () => {
    if (!isExpanded) {
      setDebugInfo(getSessionDebugInfo());
    }
    setIsExpanded(!isExpanded);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card variant="default" elevation="md">
        <CardContent className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span className="text-sm">Session Debug</span>
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {isExpanded && debugInfo && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-64">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDebugPanel;

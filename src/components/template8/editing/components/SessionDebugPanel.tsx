
import React, { useState } from 'react';
import { Button } from '@/components/template8/design-system/components/Button';
import { Card, CardContent } from '@/components/template8/design-system/components/Card';
import { Bug, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';

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

  const analyzeSessionHealth = (info: any) => {
    if (!info) return { status: 'unknown', issues: [] };

    const issues = [];
    const health = info.sessionHealth || {};

    if (!health.primaryStorage && !health.backupStorage) {
      issues.push('No session storage found');
    }

    if (info.currentState?.recoveredData?._demoId && 
        !info.validation?.isValidUUID(info.currentState.recoveredData._demoId)) {
      issues.push('Invalid demo ID format detected');
    }

    if (!info.currentState?.recoveredData?.businessName) {
      issues.push('Missing business name in session data');
    }

    const status = issues.length === 0 ? 'healthy' : 
                  issues.length <= 2 ? 'warning' : 'error';

    return { status, issues };
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const healthAnalysis = debugInfo ? analyzeSessionHealth(debugInfo) : null;

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
              {healthAnalysis && (
                <div className="flex items-center ml-2">
                  {healthAnalysis.status === 'healthy' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {healthAnalysis.status === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  {healthAnalysis.status === 'error' && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {isExpanded && debugInfo && (
            <div className="mt-3 space-y-3">
              {/* Health Analysis */}
              {healthAnalysis && (
                <div className="p-2 bg-gray-50 rounded text-xs">
                  <div className="font-semibold mb-1">Health Status: 
                    <span className={`ml-1 ${
                      healthAnalysis.status === 'healthy' ? 'text-green-600' :
                      healthAnalysis.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {healthAnalysis.status.toUpperCase()}
                    </span>
                  </div>
                  {healthAnalysis.issues.length > 0 && (
                    <div>
                      <div className="font-semibold text-red-600 mb-1">Issues:</div>
                      {healthAnalysis.issues.map((issue, index) => (
                        <div key={index} className="text-red-600">• {issue}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Full Debug Info */}
              <div className="p-3 bg-gray-50 rounded text-xs overflow-auto max-h-64">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDebugPanel;

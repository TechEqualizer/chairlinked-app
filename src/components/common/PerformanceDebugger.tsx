
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  totalRenderTime: number;
  averageRenderTime: number;
}

export const PerformanceDebugger: React.FC<{ componentName: string }> = ({ componentName }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    totalRenderTime: 0,
    averageRenderTime: 0
  });
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => {
        const newRenderCount = prev.renderCount + 1;
        const newTotalTime = prev.totalRenderTime + renderTime;
        
        return {
          renderCount: newRenderCount,
          lastRenderTime: renderTime,
          totalRenderTime: newTotalTime,
          averageRenderTime: newTotalTime / newRenderCount
        };
      });

      // Log slow renders
      if (renderTime > 100) {
        console.warn(`[Performance] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          variant="outline"
          size="sm"
          className="bg-yellow-100 text-yellow-800 border-yellow-300"
        >
          Debug {componentName}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 bg-yellow-50 border-yellow-200 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-yellow-800">{componentName} Metrics</h4>
          <Button
            onClick={() => setShowDebug(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-yellow-600"
          >
            ×
          </Button>
        </div>
        <div className="space-y-1 text-xs text-yellow-700">
          <div>Renders: {metrics.renderCount}</div>
          <div>Last: {metrics.lastRenderTime.toFixed(2)}ms</div>
          <div>Avg: {metrics.averageRenderTime.toFixed(2)}ms</div>
          <div>Total: {metrics.totalRenderTime.toFixed(2)}ms</div>
        </div>
        <Button
          onClick={() => setMetrics({
            renderCount: 0,
            lastRenderTime: 0,
            totalRenderTime: 0,
            averageRenderTime: 0
          })}
          variant="outline"
          size="sm"
          className="mt-2 w-full text-xs"
        >
          Reset
        </Button>
      </Card>
    </div>
  );
};

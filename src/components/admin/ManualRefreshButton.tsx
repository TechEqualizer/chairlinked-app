
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Keyboard, Wifi, WifiOff, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * A button component that allows manual refreshing of data with status indicators
 */
interface ManualRefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastRefresh?: Date | null;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
}

export const ManualRefreshButton: React.FC<ManualRefreshButtonProps> = ({
  onRefresh,
  isRefreshing,
  lastRefresh,
  connectionStatus = 'connecting'
}) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-3 h-3 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-3 h-3 text-red-500" />;
      case 'connecting':
        return <Clock className="w-3 h-3 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getTooltipContent = () => {
    const statusText = {
      connected: 'Real-time updates active',
      disconnected: 'Using backup polling',
      connecting: 'Connecting to real-time updates'
    }[connectionStatus];

    const lastRefreshText = lastRefresh 
      ? ` • Last refresh: ${lastRefresh.toLocaleTimeString()}`
      : '';

    return `Refresh entire page (Ctrl/Cmd + R) • ${statusText}${lastRefreshText}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
            <div className="flex items-center gap-1">
              {getConnectionIcon()}
              <Keyboard className="w-3 h-3 opacity-60" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

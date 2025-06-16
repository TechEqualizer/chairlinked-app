
import { useState, useEffect, useCallback, useRef } from 'react';
import type { UseSimpleDemoRefreshProps } from './refresh/types';
import { useConnectionManager } from './refresh/useConnectionManager';
import { usePollingFallback } from './refresh/usePollingFallback';
import { useHeartbeat } from './refresh/useHeartbeat';
import { useRefreshLogic } from './refresh/useRefreshLogic';

/**
 * A hook that provides real-time refresh capabilities for demo sites with
 * robust error handling, reconnection logic, and fallback mechanisms.
 */
export const useSimpleDemoRefresh = ({ onRefresh }: UseSimpleDemoRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  
  const mountedRef = useRef(true);
  const onRefreshRef = useRef(onRefresh);
  
  // Update ref when onRefresh changes
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // Initialize refresh logic
  const { performRefresh, handleManualRefresh } = useRefreshLogic(
    onRefreshRef.current,
    setLastRefresh,
    mountedRef
  );

  // Initialize connection management
  const { setupRealtimeChannel, cleanup: cleanupConnection, channelRef, reconnectAttemptsRef } = useConnectionManager(
    performRefresh,
    setConnectionStatus,
    mountedRef
  );

  // Initialize polling fallback
  const { setupPollingFallback, cleanup: cleanupPolling } = usePollingFallback(
    performRefresh,
    mountedRef
  );

  // Initialize heartbeat
  const { setupHeartbeat, cleanup: cleanupHeartbeat } = useHeartbeat(
    connectionStatus,
    setupRealtimeChannel,
    setConnectionStatus,
    channelRef,
    mountedRef
  );

  // Set up realtime subscription
  useEffect(() => {
    if (!mountedRef.current) return;

    console.log('[SimpleDemoRefresh] Initial setup of real-time subscription');
    
    // Create and store the channel
    channelRef.current = setupRealtimeChannel();
    
    // Initial data load
    (async () => {
      try {
        await performRefresh('initial');
      } catch (err) {
        console.error('[SimpleDemoRefresh] Initial data load failed:', err);
      }
    })();
    
    // Set up heartbeat
    const heartbeatInterval = setupHeartbeat();
    
    // Cleanup function
    return () => {
      console.log('[SimpleDemoRefresh] Cleaning up subscription and timers');
      mountedRef.current = false;
      
      cleanupConnection();
      cleanupPolling();
      cleanupHeartbeat();
    };
  }, [performRefresh, setupRealtimeChannel, setupHeartbeat, cleanupConnection, cleanupPolling, cleanupHeartbeat]);

  // Page visibility refresh with reconnection logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[SimpleDemoRefresh] Page hidden, no action needed');
        return;
      }
      
      console.log('[SimpleDemoRefresh] Page visible again');
      
      if (!mountedRef.current) return;
      
      // Perform a refresh
      (async () => {
        try {
          await performRefresh('visibility');
        } catch (err) {
          console.error('[SimpleDemoRefresh] Visibility refresh failed:', err);
        }
      })();
      
      // Check connection status and reconnect if needed
      if (connectionStatus === 'disconnected') {
        console.log('[SimpleDemoRefresh] Connection was disconnected, attempting to reconnect');
        // Reset reconnect attempts to give it a fresh start
        reconnectAttemptsRef.current = 0;
        channelRef.current = setupRealtimeChannel();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [performRefresh, setupRealtimeChannel, connectionStatus, reconnectAttemptsRef, channelRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Manual refresh wrapper
  const wrappedManualRefresh = useCallback(() => {
    handleManualRefresh(setIsRefreshing);
  }, [handleManualRefresh]);

  return {
    isRefreshing,
    handleManualRefresh: wrappedManualRefresh,
    lastRefresh,
    connectionStatus
  };
};

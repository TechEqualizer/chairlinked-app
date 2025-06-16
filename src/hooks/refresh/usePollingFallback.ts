
import { useRef, useCallback } from 'react';
import { REFRESH_CONFIG } from './constants';

export const usePollingFallback = (
  performRefresh: (source: string) => Promise<void>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const setupPollingFallback = useCallback(() => {
    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    console.log('[PollingFallback] Setting up polling fallback mechanism');
    pollingIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        console.log('[PollingFallback] Executing polling refresh');
        (async () => {
          try {
            await performRefresh('polling');
          } catch (err) {
            console.error('[PollingFallback] Polling refresh failed:', err);
          }
        })();
      }
    }, REFRESH_CONFIG.POLLING_INTERVAL_MS);
    
    return pollingIntervalRef.current;
  }, [performRefresh, mountedRef]);

  const cleanup = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  return {
    setupPollingFallback,
    cleanup
  };
};

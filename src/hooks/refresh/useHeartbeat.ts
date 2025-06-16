import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { REFRESH_CONFIG } from './constants';

export const useHeartbeat = (
  connectionStatus: 'connected' | 'disconnected' | 'connecting',
  setupRealtimeChannel: () => any,
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void,
  channelRef: React.MutableRefObject<any>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const setupHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    console.log('[Heartbeat] Setting up connection heartbeat');
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      
      // Send a simple query to keep the connection alive
      const heartbeatPromise = supabase
        .from('chairlinked_sites')
        .select('count', { count: 'exact', head: true })
        .eq('site_type', 'demo');
        
      // Convert to proper promise and handle errors
      Promise.resolve(heartbeatPromise)
        .then(() => {
          console.log('[Heartbeat] Heartbeat sent successfully');
        })
        .catch(err => {
          console.warn('[Heartbeat] Heartbeat failed, connection may be lost:', err);
          
          // If heartbeat fails, check if we need to reconnect
          if (connectionStatus === 'connected' && mountedRef.current) {
            console.log('[Heartbeat] Attempting to reconnect after heartbeat failure');
            setConnectionStatus('connecting');
            channelRef.current = setupRealtimeChannel();
          }
        });
    }, REFRESH_CONFIG.HEARTBEAT_INTERVAL_MS);
    
    return heartbeatIntervalRef.current;
  }, [connectionStatus, setupRealtimeChannel, setConnectionStatus, channelRef, mountedRef]);

  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  return {
    setupHeartbeat,
    cleanup
  };
};

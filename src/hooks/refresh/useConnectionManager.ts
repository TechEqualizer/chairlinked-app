
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RealtimePayload } from './types';
import { REFRESH_CONFIG } from './constants';

export const useConnectionManager = (
  performRefresh: (source: string) => Promise<void>,
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void,
  mountedRef: React.MutableRefObject<boolean>
) => {
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const setupRealtimeChannel = useCallback(() => {
    if (!mountedRef.current) return null;
    
    // Clean up existing resources
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (channelRef.current) {
      console.log('[ConnectionManager] Removing existing channel before creating a new one');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    console.log('[ConnectionManager] Setting up new real-time subscription');
    setConnectionStatus('connecting');

    // Create a unique channel name with timestamp to avoid conflicts
    const channelName = `demo-sites-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chairlinked_sites',
          filter: 'site_type=eq.demo'
        },
        async (payload: RealtimePayload) => {
          if (!mountedRef.current) return;
          
          console.log('[ConnectionManager] Real-time change detected:', {
            event: payload.eventType,
            table: payload.table,
            id: payload.new?.id || payload.old?.id
          });
          
          // Reset reconnect attempts on successful message
          reconnectAttemptsRef.current = 0;
          
          // Small delay to ensure database consistency
          setTimeout(async () => {
            try {
              await performRefresh('realtime');
              
              // Show notification for new demos
              if (payload.eventType === 'INSERT' && payload.new?.business_name) {
                toast({
                  title: "New demo site created",
                  description: `${payload.new.business_name} has been added`,
                  duration: 4000,
                });
              }
            } catch (error) {
              console.error('[ConnectionManager] Real-time refresh failed:', error);
            }
          }, 100);
        }
      )
      .subscribe((status) => {
        if (!mountedRef.current) return;
        
        console.log('[ConnectionManager] Subscription status:', status);
        
        switch (status) {
          case 'SUBSCRIBED':
            setConnectionStatus('connected');
            console.log('[ConnectionManager] Real-time subscription active');
            reconnectAttemptsRef.current = 0;
            break;
          case 'CHANNEL_ERROR':
          case 'TIMED_OUT':
          case 'CLOSED':
            setConnectionStatus('disconnected');
            console.warn('[ConnectionManager] Real-time subscription failed:', status);
            
            if (reconnectAttemptsRef.current < REFRESH_CONFIG.MAX_RECONNECT_ATTEMPTS && mountedRef.current) {
              const delay = REFRESH_CONFIG.RECONNECT_DELAY_MS * Math.pow(1.5, reconnectAttemptsRef.current);
              console.log(`[ConnectionManager] Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${REFRESH_CONFIG.MAX_RECONNECT_ATTEMPTS})`);
              
              reconnectTimeoutRef.current = setTimeout(() => {
                if (mountedRef.current) {
                  console.log('[ConnectionManager] Executing reconnection attempt');
                  reconnectAttemptsRef.current += 1;
                  setupRealtimeChannel();
                }
              }, delay);
            } else if (reconnectAttemptsRef.current >= REFRESH_CONFIG.MAX_RECONNECT_ATTEMPTS) {
              console.warn('[ConnectionManager] Max reconnection attempts reached, falling back to polling');
            }
            break;
        }
      });

    return channel;
  }, [performRefresh, toast, setConnectionStatus, mountedRef]);

  const cleanup = useCallback(() => {
    console.log('[ConnectionManager] Cleaning up connection resources');
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  return {
    setupRealtimeChannel,
    cleanup,
    channelRef,
    reconnectAttemptsRef
  };
};

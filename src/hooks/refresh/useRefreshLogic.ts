
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useRefreshLogic = (
  onRefresh: () => Promise<void>,
  setLastRefresh: (date: Date) => void,
  mountedRef: React.MutableRefObject<boolean>
) => {
  const { toast } = useToast();

  // Simplified refresh function
  const performRefresh = useCallback(async (source: string) => {
    if (!mountedRef.current) return;
    
    console.log(`[RefreshLogic] Performing refresh from: ${source}`);
    try {
      await onRefresh();
      setLastRefresh(new Date());
    } catch (error) {
      console.error(`[RefreshLogic] Refresh failed:`, error);
      throw error;
    }
  }, [onRefresh, setLastRefresh, mountedRef]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async (setIsRefreshing: (value: boolean) => void) => {
    setIsRefreshing(true);
    try {
      await performRefresh('manual');
      toast({
        title: "Dashboard refreshed",
        description: "Demo sites list has been updated",
        duration: 2000,
      });
    } catch (error) {
      console.error('[RefreshLogic] Manual refresh failed:', error);
      toast({
        title: "Refresh failed",
        description: "Unable to refresh demo sites",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [performRefresh, toast]);

  return {
    performRefresh,
    handleManualRefresh
  };
};

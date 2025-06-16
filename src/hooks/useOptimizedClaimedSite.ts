
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { getCachedData, setCachedData, clearCache as clearCacheUtil } from './utils/siteCache';
import { findClaimedSite } from './utils/siteFetcher';

export const useOptimizedClaimedSite = () => {
  const [claimedSite, setClaimedSite] = useState<SiteWithLifecycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  
  const fetchInProgressRef = useRef<Promise<void> | null>(null);
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const maxRetries = 2; // Reduced from 3 to 2 for faster resolution

  // Enhanced fetch function with aggressive timeout handling
  const fetchClaimedSite = useCallback(async (forceRefresh = false): Promise<void> => {
    if (!user) {
      console.log('[useOptimizedClaimedSite] No user found');
      if (mountedRef.current) {
        setClaimedSite(null);
        setLoading(false);
      }
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh && retryCountRef.current === 0) {
      const cachedData = getCachedData(user.email);
      if (cachedData) {
        console.log('[useOptimizedClaimedSite] Using cached data');
        if (mountedRef.current) {
          setClaimedSite(cachedData.claimedSite);
          setLoading(false);
        }
        return;
      }
    }

    // Prevent duplicate requests
    if (fetchInProgressRef.current && !forceRefresh) {
      console.log('[useOptimizedClaimedSite] Request already in progress, waiting...');
      try {
        await fetchInProgressRef.current;
      } catch (err) {
        console.error('[useOptimizedClaimedSite] Error waiting for existing request:', err);
      }
      return;
    }

    const fetchPromise = (async () => {
      if (!mountedRef.current) return;

      console.log('[useOptimizedClaimedSite] Starting fetch attempt', retryCountRef.current + 1, 'for user:', { email: user.email, id: user.id });

      try {
        if (mountedRef.current) {
          setLoading(true);
          setError(null);
        }

        // Aggressive timeout - 6 seconds total
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 6 seconds')), 6000);
        });

        const latestClaimedSite = await Promise.race([
          findClaimedSite(user),
          timeoutPromise
        ]);

        if (mountedRef.current) {
          setClaimedSite(latestClaimedSite);
          if (latestClaimedSite) {
            setCachedData(latestClaimedSite, user.email);
          }
          retryCountRef.current = 0; // Reset retry count on success
        }

      } catch (err) {
        console.error('[useOptimizedClaimedSite] Error (attempt', retryCountRef.current + 1, '):', err);
        
        if (mountedRef.current) {
          retryCountRef.current += 1;
          
          // If we haven't exceeded max retries, try again with shorter delay
          if (retryCountRef.current < maxRetries) {
            console.log('[useOptimizedClaimedSite] Retrying in 1 second...');
            setTimeout(() => {
              if (mountedRef.current) {
                fetchClaimedSite(true);
              }
            }, 1000); // Reduced from 2000 to 1000ms
          } else {
            // Max retries exceeded, set error and stop loading
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claimed site after multiple attempts';
            setError(errorMessage);
            setClaimedSite(null); // Ensure we set to null on final failure
            retryCountRef.current = 0; // Reset for future attempts
          }
        }
      } finally {
        if (mountedRef.current && (retryCountRef.current === 0 || retryCountRef.current >= maxRetries)) {
          setLoading(false);
        }
      }
    })();

    fetchInProgressRef.current = fetchPromise;
    try {
      await fetchPromise;
    } catch (err) {
      console.error('[useOptimizedClaimedSite] Error in main fetch promise:', err);
    } finally {
      fetchInProgressRef.current = null;
    }
  }, [user]);

  // Initial fetch with cache check
  useEffect(() => {
    if (user) {
      fetchClaimedSite();
    } else {
      setLoading(false);
    }
  }, [fetchClaimedSite, user]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Manual refresh function
  const refreshClaimedSite = useCallback(() => {
    retryCountRef.current = 0; // Reset retry count
    clearCacheUtil(); // Clear cache on manual refresh
    fetchClaimedSite(true);
  }, [fetchClaimedSite]);
  
  const clearCache = useCallback(() => {
    clearCacheUtil();
  }, []);

  return { 
    claimedSite, 
    loading, 
    error, 
    refreshClaimedSite,
    clearCache
  };
};

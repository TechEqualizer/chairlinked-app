import { useState, useEffect } from 'react';

/**
 * Hook to stabilize loading states and prevent flickering
 * Shows loading for a minimum duration and buffers rapid state changes
 */
export function useStableLoading(isLoading: boolean, minLoadingTime = 500, bufferTime = 200) {
  const [stableLoading, setStableLoading] = useState(isLoading);
  const [lastLoadingChange, setLastLoadingChange] = useState(Date.now());

  useEffect(() => {
    const now = Date.now();
    
    if (isLoading) {
      // Immediately show loading state
      setStableLoading(true);
      setLastLoadingChange(now);
    } else {
      // Buffer the loading=false state to prevent flickering
      const timeSinceLastChange = now - lastLoadingChange;
      
      if (timeSinceLastChange < minLoadingTime) {
        // Not enough time has passed, delay hiding loading
        const remainingTime = minLoadingTime - timeSinceLastChange;
        const timer = setTimeout(() => {
          setStableLoading(false);
        }, remainingTime);
        
        return () => clearTimeout(timer);
      } else {
        // Add a small buffer to prevent rapid flickering
        const timer = setTimeout(() => {
          setStableLoading(false);
        }, bufferTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, lastLoadingChange, minLoadingTime, bufferTime]);

  return stableLoading;
}
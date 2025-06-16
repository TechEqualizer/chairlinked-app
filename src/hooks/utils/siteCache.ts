
import { SiteWithLifecycle } from '@/types/siteLifecycle';

interface CachedData {
  claimedSite: SiteWithLifecycle | null;
  timestamp: number;
  userEmail: string;
}

const CACHE_KEY = 'chairlinked_claimed_site_cache';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const getCachedData = (userEmail: string | undefined): CachedData | null => {
  if (!userEmail) return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedCache = JSON.parse(cached) as CachedData;
      const isExpired = Date.now() - parsedCache.timestamp > CACHE_DURATION;
      const isCorrectUser = parsedCache.userEmail === userEmail;
      
      if (!isExpired && isCorrectUser) {
        return parsedCache;
      }
    }
  } catch (error) {
    console.warn('[siteCache] Cache read error:', error);
  }
  return null;
};

export const setCachedData = (data: SiteWithLifecycle | null, userEmail: string | undefined) => {
  if (!userEmail) return;
  
  try {
    const cacheData: CachedData = {
      claimedSite: data,
      timestamp: Date.now(),
      userEmail: userEmail,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('[siteCache] Cache write error:', error);
  }
};

export const clearCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('[siteCache] Cache clear error:', error);
  }
};

import { useState, useEffect } from 'react';
import { breakpoints } from '../tokens';

/**
 * Hook for responsive design based on media queries
 * 
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Predefined media query hooks for common breakpoints
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${breakpoints.md})`);
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`);
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
}

export function useIsLargeDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.xl})`);
}

/**
 * Hook that returns the current breakpoint
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm})`);
  const isTablet = useMediaQuery(`(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`);
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`);
  const isLargeDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`);
  const isExtraLargeDesktop = useMediaQuery(`(min-width: ${breakpoints.xl})`);

  if (isExtraLargeDesktop) return '2xl';
  if (isLargeDesktop) return 'xl';
  if (isDesktop) return 'lg';
  if (isTablet) return 'md';
  if (isMobile) return 'sm';
  return 'xs';
}
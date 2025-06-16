import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  width: number;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Initialize with current window size if available
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      let breakpoint: Breakpoint = 'desktop';
      if (isMobile) breakpoint = 'mobile';
      else if (isTablet) breakpoint = 'tablet';

      return {
        isMobile,
        isTablet,
        isDesktop,
        breakpoint,
        width,
      };
    }

    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'desktop',
      width: 1200,
    };
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events for better performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const isDesktop = width >= 1024;

        let breakpoint: Breakpoint = 'desktop';
        if (isMobile) breakpoint = 'mobile';
        else if (isTablet) breakpoint = 'tablet';

        setState(prevState => {
          // Only update if breakpoint actually changed to avoid unnecessary re-renders
          if (prevState.breakpoint !== breakpoint || Math.abs(prevState.width - width) > 50) {
            return {
              isMobile,
              isTablet,
              isDesktop,
              breakpoint,
              width,
            };
          }
          return prevState;
        });
      }, 100); // 100ms debounce
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}
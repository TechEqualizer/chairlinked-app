
import React, { useEffect } from 'react';

interface PerformanceEvent {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceTracker {
  private static events: PerformanceEvent[] = [];
  private static timers: Map<string, number> = new Map();

  static startTimer(name: string) {
    this.timers.set(name, performance.now());
  }

  static endTimer(name: string) {
    const startTime = this.timers.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.events.push({
        name,
        duration,
        timestamp: Date.now()
      });
      this.timers.delete(name);
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }

  static getEvents() {
    return this.events;
  }

  static clearEvents() {
    this.events = [];
  }
}

const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Monitor page load performance
    const handleLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
        
        if (loadTime > 3000) {
          console.warn('Page load time is slow. Consider optimizing.');
        }
      }
    };

    // Monitor large DOM mutations
    const observer = new MutationObserver((mutations) => {
      if (mutations.length > 50) {
        console.warn('Large DOM mutation detected. This may impact performance.');
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export { PerformanceTracker, PerformanceMonitor };

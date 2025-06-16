import { useState, useEffect, useRef } from 'react';
import { transitions } from '../tokens';

/**
 * Animation options
 */
export interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  onComplete?: () => void;
}

/**
 * Hook for managing animations
 */
export function useAnimation(
  initialState: boolean = false,
  options: AnimationOptions = {}
) {
  const [isAnimating, setIsAnimating] = useState(initialState);
  const [hasAnimated, setHasAnimated] = useState(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    duration = 300,
    delay = 0,
    easing = transitions.timing.inOut,
    onComplete,
  } = options;

  // Start animation
  const startAnimation = () => {
    setIsAnimating(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setHasAnimated(true);
      if (onComplete) onComplete();
    }, duration + delay);
  };

  // Stop animation
  const stopAnimation = () => {
    setIsAnimating(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Reset animation
  const resetAnimation = () => {
    setIsAnimating(false);
    setHasAnimated(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Toggle animation
  const toggleAnimation = () => {
    if (isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isAnimating,
    hasAnimated,
    startAnimation,
    stopAnimation,
    resetAnimation,
    toggleAnimation,
    style: {
      transition: `all ${duration}ms ${easing} ${delay}ms`,
    },
  };
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(
  options: AnimationOptions & {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
  } = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const animation = useAnimation(false, options);

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animation.startAnimation();
          observer.unobserve(entry.target);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, root, rootMargin]);

  return {
    ref,
    isVisible,
    ...animation,
  };
}
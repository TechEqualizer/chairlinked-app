import { useState, useEffect } from 'react';
import { colors } from '../tokens';

/**
 * Theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme colors interface
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
}

/**
 * Default theme colors
 */
const defaultThemeColors: Record<'light' | 'dark', ThemeColors> = {
  light: {
    primary: colors.primary[600],
    secondary: colors.secondary[500],
    accent: colors.warning[500],
    background: colors.neutral[50],
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    border: colors.neutral[200],
    surface: 'white',
  },
  dark: {
    primary: colors.primary[400],
    secondary: colors.secondary[400],
    accent: colors.warning[400],
    background: colors.neutral[900],
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    border: colors.neutral[700],
    surface: colors.neutral[800],
  },
};

/**
 * Hook for managing theme mode and colors
 */
export function useTheme(initialMode: ThemeMode = 'system') {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');
  const [colors, setColors] = useState<ThemeColors>(defaultThemeColors.light);
  const [customColors, setCustomColors] = useState<Partial<ThemeColors>>({});

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (mode === 'system') {
        setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Update resolved mode when mode changes
  useEffect(() => {
    if (mode === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedMode(isDarkMode ? 'dark' : 'light');
    } else {
      setResolvedMode(mode as 'light' | 'dark');
    }
  }, [mode]);

  // Update colors when resolved mode or custom colors change
  useEffect(() => {
    const baseColors = defaultThemeColors[resolvedMode];
    setColors({
      ...baseColors,
      ...customColors,
    });
  }, [resolvedMode, customColors]);

  // Set theme mode
  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    
    // Save to localStorage
    localStorage.setItem('template8-theme', newMode);
  };

  // Set custom colors
  const setThemeColors = (newColors: Partial<ThemeColors>) => {
    setCustomColors(prev => ({
      ...prev,
      ...newColors,
    }));
  };

  // Reset custom colors
  const resetThemeColors = () => {
    setCustomColors({});
  };

  return {
    mode,
    resolvedMode,
    colors,
    setTheme,
    setThemeColors,
    resetThemeColors,
    isDark: resolvedMode === 'dark',
    isLight: resolvedMode === 'light',
  };
}
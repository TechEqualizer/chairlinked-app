import { colors } from '../tokens';

/**
 * Converts a hex color to RGBA
 * 
 * @param hex - Hex color code (e.g., #FF0000)
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Lightens a color by a percentage
 * 
 * @param color - Hex color code
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export function lightenColor(color: string, percent: number = 10): string {
  // Remove # if present
  color = color.replace('#', '');
  
  // Parse hex values
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  
  // Lighten
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Darkens a color by a percentage
 * 
 * @param color - Hex color code
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export function darkenColor(color: string, percent: number = 10): string {
  // Remove # if present
  color = color.replace('#', '');
  
  // Parse hex values
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  
  // Darken
  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generates a color palette from a base color
 * 
 * @param baseColor - Base hex color
 * @returns Object with color variations
 */
export function generateColorPalette(baseColor: string) {
  return {
    50: lightenColor(baseColor, 90),
    100: lightenColor(baseColor, 80),
    200: lightenColor(baseColor, 60),
    300: lightenColor(baseColor, 40),
    400: lightenColor(baseColor, 20),
    500: baseColor,
    600: darkenColor(baseColor, 10),
    700: darkenColor(baseColor, 20),
    800: darkenColor(baseColor, 30),
    900: darkenColor(baseColor, 40),
    950: darkenColor(baseColor, 50),
  };
}

/**
 * Checks if a color is light or dark
 * 
 * @param color - Hex color code
 * @returns Boolean indicating if the color is light
 */
export function isLightColor(color: string): boolean {
  // Remove # if present
  color = color.replace('#', '');
  
  // Parse hex values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calculate luminance
  // Formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if light, false if dark
  return luminance > 0.5;
}

/**
 * Gets a contrasting text color (black or white) based on background color
 * 
 * @param backgroundColor - Hex color code
 * @returns '#000000' or '#FFFFFF' depending on contrast
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

/**
 * Gets a color from the design system color palette
 * 
 * @param colorName - Color name (e.g., 'primary', 'secondary')
 * @param shade - Color shade (e.g., 500, 600)
 * @returns Hex color code
 */
export function getDesignColor(
  colorName: keyof typeof colors,
  shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 = 500
): string {
  if (colors[colorName] && colors[colorName][shade]) {
    return colors[colorName][shade];
  }
  
  // Fallback to primary color
  return colors.primary[500];
}
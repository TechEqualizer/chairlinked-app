import { luxuryPalette } from "./palettes/luxuryPalette";
import { luxuryFontClass, luxuryFontFamily } from "./fonts/luxuryFont";

type BrandVibe = 'bold' | 'modern' | 'feminine' | 'luxury';

type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  textMuted: string;
  border: string;
  shadow: string;
};

export class StyleGenerator {
  static getVibePalette(brandVibe?: BrandVibe): Palette {
    switch (brandVibe) {
      case 'luxury':
        return luxuryPalette;
      case 'feminine':
        return {
          primary: "#EC4899",
          secondary: "#FEF2F2",
          accent: "#F97316",
          background: "#fff0fa",
          backgroundSecondary: "#ffe6dc",
          text: "#BA227B",
          textMuted: "#F9A8D4",
          border: "#FCC1E6",
          shadow: "0 6px 22px rgba(236,72,153,0.10)"
        };
      case 'bold':
        return {
          primary: "#DC2626",
          secondary: "#FFF1F2",
          accent: "#F59E0B",
          background: "#fff0f3",
          backgroundSecondary: "#ffe2e9",
          text: "#7F1D1D",
          textMuted: "#F87171",
          border: "#FDA4AF",
          shadow: "0 8px 32px rgba(220,38,38,0.13)"
        };
      case 'modern':
      default:
        return {
          primary: "#1E40AF",
          secondary: "#EFF6FF",
          accent: "#3B82F6",
          background: "#e0f2ff",
          backgroundSecondary: "#fff",
          text: "#172554",
          textMuted: "#64748b",
          border: "#60A5FA",
          shadow: "0 4px 18px rgba(59,130,246,0.14)"
        };
    }
  }

  static getFontClass(brandVibe?: BrandVibe): string {
    switch (brandVibe) {
      case 'luxury':
        return luxuryFontClass;
      case 'feminine':
        return 'font-serif';
      case 'bold':
      case 'modern':
      default:
        return 'font-sans';
    }
  }

  static getAccentColor(brandVibe?: BrandVibe): string {
    return this.getVibePalette(brandVibe).accent;
  }

  static getBackgroundStyle(colorScheme: string | string[], brandVibe?: BrandVibe): string {
    // Accept multiple colors as background if given
    const colors = Array.isArray(colorScheme)
      ? colorScheme
      : typeof colorScheme === 'string'
        ? [colorScheme]
        : [this.getVibePalette(brandVibe).background];
    if (colors.length > 1) {
      return `linear-gradient(135deg, ${colors.join(', ')} 100%)`;
    }
    const palette = this.getVibePalette(brandVibe);
    return `linear-gradient(135deg, ${colors[0]} 0%, ${palette.backgroundSecondary} 50%, #fff 100%)`;
  }

  static getFontFamily(brandVibe?: BrandVibe): string {
    switch (brandVibe) {
      case 'luxury':
        return luxuryFontFamily;
      case 'feminine':
        return 'Playfair Display, serif';
      case 'bold':
        return 'Oswald, sans-serif';
      case 'modern':
      default:
        return 'Inter, sans-serif';
    }
  }
}

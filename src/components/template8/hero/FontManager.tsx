
import React, { useEffect } from "react";

interface Font {
  value: string;
  label: string;
  class: string;
  googleFontUrl: string;
  category: string;
}

export const fontOptions: Font[] = [
  // Modern Fonts
  { value: "inter", label: "Inter", class: "font-inter", googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap", category: "Modern" },
  { value: "poppins", label: "Poppins", class: "font-poppins", googleFontUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap", category: "Modern" },
  { value: "outfit", label: "Outfit", class: "font-outfit", googleFontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap", category: "Modern" },
  { value: "work-sans", label: "Work Sans", class: "font-work-sans", googleFontUrl: "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap", category: "Modern" },
  
  // Luxury Fonts
  { value: "playfair-display", label: "Playfair Display", class: "font-playfair", googleFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap", category: "Luxury" },
  { value: "cormorant-garamond", label: "Cormorant", class: "font-cormorant", googleFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap", category: "Luxury" },
  { value: "crimson-text", label: "Crimson Text", class: "font-crimson", googleFontUrl: "https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap", category: "Luxury" },
  
  // Bold Fonts
  { value: "oswald", label: "Oswald", class: "font-oswald", googleFontUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap", category: "Bold" },
  { value: "montserrat", label: "Montserrat", class: "font-montserrat", googleFontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap", category: "Bold" },
  { value: "roboto-condensed", label: "Roboto Condensed", class: "font-roboto-condensed", googleFontUrl: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap", category: "Bold" },
  
  // Creative Fonts
  { value: "comfortaa", label: "Comfortaa", class: "font-comfortaa", googleFontUrl: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap", category: "Creative" },
  { value: "nunito", label: "Nunito", class: "font-nunito", googleFontUrl: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap", category: "Creative" },
  { value: "space-grotesk", label: "Space Grotesk", class: "font-space-grotesk", googleFontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap", category: "Creative" },
  
  // Classic Fonts
  { value: "lora", label: "Lora", class: "font-lora", googleFontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap", category: "Classic" },
  { value: "merriweather", label: "Merriweather", class: "font-merriweather", googleFontUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap", category: "Classic" },
  
  // Default system fonts
  { value: "sans-serif", label: "Sans Serif", class: "font-sans", googleFontUrl: "", category: "System" },
  { value: "serif", label: "Serif", class: "font-serif", googleFontUrl: "", category: "System" },
  { value: "mono", label: "Monospace", class: "font-mono", googleFontUrl: "", category: "System" }
];

interface FontManagerProps {
  selectedFont: string;
  onFontChange: (fontValue: string, fontClass: string) => void;
}

const FontManager: React.FC<FontManagerProps> = ({ selectedFont, onFontChange }) => {
  // Load Google Font when font changes
  useEffect(() => {
    const selectedFontData = fontOptions.find(font => font.value === selectedFont);
    if (selectedFontData && selectedFontData.googleFontUrl) {
      const existingLink = document.querySelector(`link[href="${selectedFontData.googleFontUrl}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = selectedFontData.googleFontUrl;
        document.head.appendChild(link);
        console.log(`[FontManager] Loaded font: ${selectedFontData.label}`);
      }
    }
  }, [selectedFont]);

  return null; // This component only handles font loading
};

export default FontManager;


import React, { useEffect } from "react";

interface Font {
  value: string;
  label: string;
  class: string;
  googleFontUrl: string;
}

export const fontOptions: Font[] = [
  { value: "inter", label: "Inter", class: "font-inter", googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" },
  { value: "playfair", label: "Playfair Display", class: "font-playfair", googleFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" },
  { value: "poppins", label: "Poppins", class: "font-poppins", googleFontUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" },
  { value: "montserrat", label: "Montserrat", class: "font-montserrat", googleFontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" },
  { value: "lora", label: "Lora", class: "font-lora", googleFontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" }
];

interface FontManagerProps {
  selectedFont: string;
}

const FontManager: React.FC<FontManagerProps> = ({ selectedFont }) => {
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

  return null;
};

export default FontManager;

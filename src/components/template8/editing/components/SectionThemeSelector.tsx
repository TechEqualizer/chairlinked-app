
import React from "react";
import { Moon, Sun, Palette, Sparkles } from "lucide-react";
import { SectionTheme } from "../../utils/themeUtils";

interface SectionThemeSelectorProps {
  currentTheme: SectionTheme;
  onThemeChange: (theme: SectionTheme) => void;
  sectionName?: string;
}

const SectionThemeSelector: React.FC<SectionThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  sectionName = "Section"
}) => {
  const themes = [
    { id: 'light' as const, label: 'Light', icon: Sun, preview: 'bg-white text-gray-900' },
    { id: 'dark' as const, label: 'Dark', icon: Moon, preview: 'bg-gray-900 text-white' },
    { id: 'auto' as const, label: 'Auto', icon: Palette, preview: 'bg-gradient-to-r from-white to-gray-900 text-gray-900' },
    { id: 'industry' as const, label: 'Industry', icon: Sparkles, preview: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">{sectionName} Theme</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                currentTheme === theme.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-8 rounded mb-2 ${theme.preview} flex items-center justify-center`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SectionThemeSelector;

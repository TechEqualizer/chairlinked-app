
import React from "react";
import { Settings } from "lucide-react";
import CollapsibleSection from "../ui/CollapsibleSection";

interface OverlayEffectsSectionProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const OverlayEffectsSection: React.FC<OverlayEffectsSectionProps> = ({ 
  pageData, 
  onUpdate 
}) => {
  // Only show for gradient backgrounds
  if (pageData.backgroundType !== 'gradient') return null;

  return (
    <CollapsibleSection
      title="Gradient Effects"
      icon={<Settings className="w-4 h-4 text-orange-600" />}
    >
      <div className="space-y-4">
        {/* Gradient Direction */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">Gradient Direction</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Diagonal ↘', value: '135deg' },
              { label: 'Vertical ↓', value: '180deg' },
              { label: 'Horizontal →', value: '90deg' },
              { label: 'Diagonal ↙', value: '45deg' }
            ].map((direction) => (
              <button
                key={direction.value}
                onClick={() => onUpdate({ gradientDirection: direction.value })}
                className={`p-2 text-xs border rounded transition-colors ${
                  (pageData.gradientDirection || '135deg') === direction.value
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {direction.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gradient Intensity */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Gradient Intensity: {Math.round((pageData.gradientIntensity || 0.8) * 100)}%
          </label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={pageData.gradientIntensity || 0.8}
            onChange={(e) => onUpdate({ gradientIntensity: parseFloat(e.target.value) })}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Subtle</span>
            <span>Intense</span>
          </div>
        </div>

        {/* Animation Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900">Animated Background</label>
          <button
            onClick={() => onUpdate({ animatedBackground: !pageData.animatedBackground })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              pageData.animatedBackground ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pageData.animatedBackground ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default OverlayEffectsSection;

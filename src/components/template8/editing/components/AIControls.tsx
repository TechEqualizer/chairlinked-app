
import React from "react";
import { RefreshCw, Undo2, Sparkles, CheckCircle } from "lucide-react";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";

interface AIControlsProps {
  currentSection: string;
  onRegenerate: () => void;
  onStyleRegenerate?: (style: string) => void;
  onUndo?: () => void;
  onUpdate: (updates: any) => void;
  isRegenerating?: boolean;
  lastResult?: any;
  canUndo?: boolean;
}

const AIControls: React.FC<AIControlsProps> = ({ 
  currentSection, 
  onRegenerate, 
  onStyleRegenerate,
  onUndo,
  onUpdate,
  isRegenerating = false,
  lastResult,
  canUndo = false
}) => {
  const handleStylePresetClick = (style: string) => {
    console.log('🎨 Applying style preset:', style);
    
    if (onStyleRegenerate) {
      onStyleRegenerate(style.toLowerCase().replace(/\s+/g, '-'));
    } else {
      // Fallback to basic style update
      onUpdate({ 
        stylePreset: style.toLowerCase().replace(/\s+/g, '-'),
        lastStyleUpdate: new Date().toISOString()
      });
    }
  };

  const stylePresets = [
    { name: 'Modern & Clean', key: 'modern-clean', color: 'from-blue-500 to-cyan-500' },
    { name: 'Luxury & Elegant', key: 'luxury-elegant', color: 'from-purple-500 to-pink-500' },
    { name: 'Bold & Dynamic', key: 'bold-dynamic', color: 'from-orange-500 to-red-500' },
    { name: 'Minimal & Simple', key: 'minimal-simple', color: 'from-gray-500 to-slate-500' }
  ];

  return (
    <div className="space-y-4">
      {/* AI Regeneration Section */}
      <div className="text-center">
        <h4 className="text-gray-900 font-medium mb-2 flex items-center justify-center gap-2">
          <Sparkles size={16} />
          AI Magic
        </h4>
        <p className="text-gray-700 text-sm mb-4">
          Let AI enhance your {currentSection.toLowerCase()} section with fresh content and styling
        </p>
        
        <div className="space-y-2">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              isRegenerating 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105'
            } text-white`}
          >
            <RefreshCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
            {isRegenerating ? 'AI Working...' : 'Regenerate with AI'}
          </button>

          {/* Undo Button */}
          {canUndo && onUndo && (
            <button
              onClick={onUndo}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
            >
              <Undo2 size={14} />
              Undo Last Change
            </button>
          )}
        </div>
      </div>

      {/* Last Regeneration Result */}
      {lastResult && (
        <EditingGlassCard variant="content" className="border-green-200 bg-green-50/90 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-green-700 font-medium text-sm">
              {lastResult.fallback ? 'Basic Enhancement Applied' : 'AI Enhancement Complete'}
            </span>
          </div>
          <div className="space-y-1">
            {lastResult.changes?.map((change: string, index: number) => (
              <p key={index} className="text-green-600 text-xs">{change}</p>
            ))}
          </div>
        </EditingGlassCard>
      )}

      {/* Style Presets */}
      <div>
        <label className="text-gray-900 text-sm font-medium block mb-2">
          Style Variations
        </label>
        <div className="space-y-2">
          {stylePresets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => handleStylePresetClick(preset.key)}
              disabled={isRegenerating}
              className={`w-full py-2 px-3 rounded-lg text-sm transition-all text-left ${
                isRegenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${preset.color}`}></div>
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips - Enhanced with better contrast */}
      <EditingGlassCard variant="content" className="border-blue-200 bg-blue-50/90 p-3">
        <h5 className="text-blue-800 font-medium text-sm mb-2 flex items-center gap-1">
          💡 AI Tips
        </h5>
        <ul className="text-blue-700 text-xs space-y-1">
          <li>• AI learns from your current content</li>
          <li>• Style presets apply instantly</li>
          <li>• Use undo to revert changes</li>
          <li>• Each regeneration is unique</li>
        </ul>
      </EditingGlassCard>
    </div>
  );
};

export default AIControls;

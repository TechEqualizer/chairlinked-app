
import React from "react";
import { motion } from "framer-motion";
import { X, Layout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface HeroLayoutPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const HeroLayoutPanel: React.FC<HeroLayoutPanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  const layoutOptions = [
    { 
      value: 'classic-split', 
      label: 'Classic Split', 
      description: 'Text on left, image on right',
      preview: 'Traditional two column layout'
    },
    { 
      value: 'modern-split', 
      label: 'Modern Split', 
      description: 'Enhanced split with image effects',
      preview: 'Modern two column with animations'
    },
    { 
      value: 'minimal-luxury', 
      label: 'Minimal Luxury', 
      description: 'Full background image with overlay text',
      preview: 'Background image with centered content'
    },
    { 
      value: 'creative-showcase', 
      label: 'Creative Showcase', 
      description: 'Asymmetric layout with decorative elements',
      preview: 'Creative offset design with effects'
    }
  ];

  const handleLayoutChange = (layoutType: string) => {
    onUpdate({ heroLayoutType: layoutType });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <Card className="shadow-xl border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Layout Options
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Choose Hero Layout</Label>
            <div className="space-y-3">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLayoutChange(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    (pageData.heroLayoutType || 'classic-split') === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm text-gray-900">{option.label}</div>
                    {(pageData.heroLayoutType || 'classic-split') === option.value && (
                      <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-3">{option.description}</div>
                  
                  {/* Layout Preview */}
                  <div className="bg-gray-100 rounded p-2 h-16">
                    <div className="text-xs text-gray-500 mb-1">{option.preview}</div>
                    {option.value === 'classic-split' && (
                      <div className="flex gap-1 h-8">
                        <div className="flex-1 bg-white rounded border border-gray-200"></div>
                        <div className="w-8 bg-gray-300 rounded"></div>
                      </div>
                    )}
                    {option.value === 'modern-split' && (
                      <div className="flex gap-1 h-8">
                        <div className="flex-1 bg-blue-100 rounded border border-blue-200"></div>
                        <div className="w-8 bg-blue-300 rounded shadow-sm"></div>
                      </div>
                    )}
                    {option.value === 'minimal-luxury' && (
                      <div className="relative h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded">
                        <div className="absolute inset-0 bg-black/20 rounded"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-2 bg-white rounded"></div>
                        </div>
                      </div>
                    )}
                    {option.value === 'creative-showcase' && (
                      <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 transform -skew-x-12"></div>
                        <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-400 rounded"></div>
                        <div className="absolute bottom-1 left-1 w-6 h-1 bg-white rounded"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Settings */}
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-sm font-medium mb-3 block">Layout Settings</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Content Position</span>
                <select 
                  value={pageData.contentAlignment || 'left'}
                  onChange={(e) => onUpdate({ contentAlignment: e.target.value })}
                  className="text-sm border border-gray-200 rounded px-2 py-1"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Text Alignment</span>
                <select 
                  value={pageData.textAlignment || 'left'}
                  onChange={(e) => onUpdate({ textAlignment: e.target.value })}
                  className="text-sm border border-gray-200 rounded px-2 py-1"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Content Width</span>
                <select 
                  value={pageData.contentWidth || 'normal'}
                  onChange={(e) => onUpdate({ contentWidth: e.target.value })}
                  className="text-sm border border-gray-200 rounded px-2 py-1"
                >
                  <option value="narrow">Narrow</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Layout Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Current Layout:</div>
            <div className="text-sm font-medium text-gray-800">
              {layoutOptions.find(opt => opt.value === (pageData.heroLayoutType || 'classic-split'))?.label || 'Classic Split'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {layoutOptions.find(opt => opt.value === (pageData.heroLayoutType || 'classic-split'))?.description}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Position: {pageData.contentAlignment || 'left'} | Text: {pageData.textAlignment || 'left'} | Width: {pageData.contentWidth || 'normal'}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HeroLayoutPanel;

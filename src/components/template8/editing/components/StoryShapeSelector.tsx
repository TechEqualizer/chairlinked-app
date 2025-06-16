
import React from "react";
import { Circle, Square, Star } from "lucide-react";

interface StoryShapeSelectorProps {
  currentShape: 'circle' | 'square' | 'star';
  onShapeChange: (shape: 'circle' | 'square' | 'star') => void;
}

const StoryShapeSelector: React.FC<StoryShapeSelectorProps> = ({
  currentShape,
  onShapeChange
}) => {
  const shapes = [
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'square', label: 'Square', icon: Square },
    { id: 'star', label: 'Star', icon: Star }
  ] as const;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Circle className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">Story Shape</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {shapes.map((shape) => {
          const IconComponent = shape.icon;
          return (
            <button
              key={shape.id}
              onClick={() => onShapeChange(shape.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                currentShape === shape.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">{shape.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StoryShapeSelector;

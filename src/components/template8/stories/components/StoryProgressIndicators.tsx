
import React from "react";
import { Progress } from "@/components/ui/progress";

interface StoryProgressIndicatorsProps {
  items: any[];
  currentItemIndex: number;
  progress: number;
}

const StoryProgressIndicators: React.FC<StoryProgressIndicatorsProps> = ({
  items,
  currentItemIndex,
  progress
}) => {
  // Handle case where items might be empty or undefined
  const validItems = items && items.length > 0 ? items : [{ duration: 5 }];
  
  return (
    <div className="absolute top-2 sm:top-3 left-2 sm:left-4 right-2 sm:right-4 z-20 flex gap-0.5 sm:gap-1">
      {validItems.map((item, idx) => (
        <Progress 
          key={idx} 
          value={idx === currentItemIndex ? progress : idx < currentItemIndex ? 100 : 0} 
          className="h-0.5 sm:h-1 bg-white/20 flex-1"
          style={{
            background: 'rgba(255,255,255,0.2)',
          }}
        />
      ))}
    </div>
  );
};

export default StoryProgressIndicators;

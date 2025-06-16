
import React from 'react';

interface ClaimProgressBarProps {
  progress: number;
}

export const ClaimProgressBar: React.FC<ClaimProgressBarProps> = ({ progress }) => {
  return (
    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

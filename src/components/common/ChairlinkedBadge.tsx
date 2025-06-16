
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ChairlinkedBadgeProps {
  variant?: 'floating' | 'inline';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  showBadge?: boolean; // New prop to control visibility
}

const ChairlinkedBadge: React.FC<ChairlinkedBadgeProps> = ({
  variant = 'floating',
  theme = 'auto',
  className = '',
  showBadge = true // Default to showing badge for backward compatibility
}) => {
  // Don't render anything if showBadge is false
  if (!showBadge) {
    return null;
  }

  const handleClick = () => {
    window.open('https://chairlinked.com', '_blank');
  };

  const baseClasses = "flex items-center gap-1 text-xs transition-all duration-200 cursor-pointer group";
  
  const variantClasses = {
    floating: "fixed bottom-4 left-4 z-40 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl hover:bg-white",
    inline: "text-current"
  };

  const themeClasses = {
    light: "text-gray-600 hover:text-gray-800",
    dark: "text-gray-400 hover:text-gray-200",
    auto: theme === 'auto' ? "text-gray-600 hover:text-gray-800" : ""
  };

  return (
    <div
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${themeClasses[theme]} ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label="Visit Chairlinked website"
    >
      <span className="font-medium">Powered by</span>
      <span className="font-bold text-purple-600 group-hover:text-purple-700">Chairlinked</span>
      <ExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
    </div>
  );
};

export default ChairlinkedBadge;

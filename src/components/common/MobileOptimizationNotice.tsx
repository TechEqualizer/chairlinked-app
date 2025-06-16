
import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileOptimizationNotice: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if user previously dismissed the notice
    const dismissed = localStorage.getItem('mobile-notice-dismissed');
    setIsDismissed(dismissed === 'true');
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mobile-notice-dismissed', 'true');
  };

  if (!isMobile || isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-blue-50 border-b border-blue-200 p-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Mobile editing is optimized for tablets. For best experience, use a desktop or tablet.
          </span>
        </div>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileOptimizationNotice;


import React from 'react';
import { Clock, Zap } from 'lucide-react';

interface ClaimUrgencyBannerProps {
  isExpired?: boolean;
  timeRemaining?: string;
}

export const ClaimUrgencyBanner: React.FC<ClaimUrgencyBannerProps> = ({
  isExpired = false,
  timeRemaining
}) => {
  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
        <div className="flex items-center gap-2 text-red-700">
          <Clock className="w-5 h-5" />
          <span className="font-bold">Demo Expired</span>
          <Zap className="w-4 h-4 text-orange-500" />
        </div>
        <p className="text-red-600 text-sm mt-1">
          This demo has expired, but you can still claim this design! Fill out the form below and we'll recreate it for you.
        </p>
      </div>
    );
  }

  if (timeRemaining) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 animate-pulse">
        <div className="flex items-center gap-2 text-orange-700">
          <Clock className="w-5 h-5" />
          <span className="font-bold">{timeRemaining} remaining</span>
          <Zap className="w-4 h-4 text-yellow-500 fill-current" />
        </div>
        <p className="text-orange-600 text-sm mt-1">
          Act fast! This demo expires soon. Claim it now to secure this design.
        </p>
      </div>
    );
  }

  return null;
};

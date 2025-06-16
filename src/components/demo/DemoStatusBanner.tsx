
import React from 'react';
import { DemoStatus } from '@/types/demoTypes';
import { Clock, AlertTriangle, XCircle } from 'lucide-react';

interface DemoStatusBannerProps {
  demoStatus: DemoStatus;
  businessName: string;
}

export const DemoStatusBanner: React.FC<DemoStatusBannerProps> = ({
  demoStatus,
  businessName
}) => {
  if (demoStatus.isExpired) {
    return (
      <div className="bg-red-600 text-white px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">
            This demo has expired. Contact us to claim "{businessName}"
          </span>
        </div>
      </div>
    );
  }

  if (demoStatus.isUrgent) {
    return (
      <div className="bg-orange-600 text-white px-4 py-2 text-center animate-pulse">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">
            Demo expires in {demoStatus.timeRemainingFormatted} - Claim now!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white px-4 py-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-5 h-5" />
        <span>
          Demo • {demoStatus.timeRemainingFormatted} remaining
        </span>
      </div>
    </div>
  );
};


import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlreadyClaimedHeaderProps {
  businessName: string;
  onClose: () => void;
}

export const AlreadyClaimedHeader: React.FC<AlreadyClaimedHeaderProps> = ({
  businessName,
  onClose
}) => {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <DialogHeader>
        <DialogTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          "{businessName}" Unavailable
        </DialogTitle>
        <DialogDescription className="text-gray-600 text-center mt-2">
          This demo site has already been claimed by another user. Each demo can only be claimed once to ensure exclusivity for our clients.
        </DialogDescription>
      </DialogHeader>
      <Button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        Close
      </Button>
    </div>
  );
};

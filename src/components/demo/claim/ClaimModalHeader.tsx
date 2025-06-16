
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, Star } from 'lucide-react';

interface ClaimModalHeaderProps {
  businessName: string;
}

export const ClaimModalHeader: React.FC<ClaimModalHeaderProps> = ({
  businessName
}) => {
  return (
    <DialogHeader>
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
        <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Claim "{businessName}"
        </DialogTitle>
        <Star className="w-6 h-6 text-yellow-500 fill-current animate-pulse" />
      </div>
      <DialogDescription className="text-gray-600 text-center mt-2">
        Fill out the form below to claim your new chairlinked design. We'll contact you within 24 hours to discuss making it yours!
      </DialogDescription>
    </DialogHeader>
  );
};

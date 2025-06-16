
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface ClaimSuccessScreenProps {
  isOpen: boolean;
  businessName: string;
  onClose: () => void;
}

export const ClaimSuccessScreen: React.FC<ClaimSuccessScreenProps> = ({
  isOpen,
  businessName,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <div className="text-center py-8 animate-fade-in">
          <div className="animate-scale-in">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
          </div>

          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎉 Claim Submitted!
          </h3>

          <p className="text-gray-600 mb-6">
            Thank you for your interest in claiming "{businessName}". 
            Our team will contact you within 24 hours to discuss next steps.
          </p>

          <Button 
            onClick={onClose} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

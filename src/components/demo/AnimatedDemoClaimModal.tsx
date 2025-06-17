
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ClaimFormContainer } from './claim/ClaimFormContainer';
import { ClaimSuccessWithAccount } from './claim/ClaimSuccessWithAccount';

interface AnimatedDemoClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoSiteId: string;
  businessName: string;
  timeRemaining?: string;
  isExpired?: boolean;
}

export const AnimatedDemoClaimModal: React.FC<AnimatedDemoClaimModalProps> = ({
  isOpen,
  onClose,
  demoSiteId,
  businessName,
  timeRemaining,
  isExpired = false
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    email: string;
    name: string;
  } | null>(null);
  
  const handleSuccess = (formData: { email: string; name: string }) => {
    setSuccessData(formData);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setSuccessData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-sm sm:max-w-xs w-[95vw] sm:w-[90vw] mx-auto p-0 gap-0 overflow-hidden bg-white rounded-2xl sm:rounded-lg border-0 shadow-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto"
        hideCloseButton={true}
      >
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-2 sm:right-2 z-20 p-1.5 sm:p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-manipulation"
          >
            <X size={18} className="sm:size-[14px] text-gray-600" />
          </button>

          <AnimatePresence mode="wait">
            {showSuccess && successData ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ClaimSuccessWithAccount
                  businessName={businessName}
                  email={successData.email}
                  name={successData.name}
                  demoSiteId={demoSiteId}
                  onClose={handleClose}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ClaimFormContainer
                  demoSiteId={demoSiteId}
                  timeRemaining={timeRemaining}
                  isExpired={isExpired}
                  onSuccess={handleSuccess}
                  onCancel={handleClose}
                  businessName={businessName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

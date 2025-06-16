
import React from 'react';
import { AnimatedDemoClaimModal } from './AnimatedDemoClaimModal';

interface DemoClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoSiteId: string;
  businessName: string;
  timeRemaining?: string;
  isExpired?: boolean;
}

export const DemoClaimModal: React.FC<DemoClaimModalProps> = (props) => {
  return <AnimatedDemoClaimModal {...props} />;
};

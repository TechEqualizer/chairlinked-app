
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

interface ContactProspectButtonProps {
  prospectEmail: string;
  prospectName: string;
  businessName: string;
}

export const ContactProspectButton: React.FC<ContactProspectButtonProps> = ({
  prospectEmail,
  prospectName,
  businessName
}) => {
  const handleEmailClick = () => {
    const subject = `Following up on your ${businessName} demo site`;
    const body = `Hi ${prospectName},\n\nI hope you're enjoying the demo site we created for ${businessName}. I wanted to follow up and see if you have any questions or if you'd like to discuss next steps.\n\nBest regards,\nThe Chairlinked Team`;
    
    const mailtoUrl = `mailto:${prospectEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEmailClick}
      className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      <Mail className="w-3 h-3" />
      Follow Up
    </Button>
  );
};

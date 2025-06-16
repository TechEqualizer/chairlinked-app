
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Clock, CheckCircle } from 'lucide-react';

interface ClaimStatusBadgeProps {
  isClaimed: boolean;
  followUpStatus?: string;
}

export const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({
  isClaimed,
  followUpStatus = 'new'
}) => {
  if (!isClaimed) {
    return null;
  }

  const getStatusConfig = () => {
    switch (followUpStatus) {
      case 'contacted':
        return {
          icon: <Clock className="w-3 h-3" />,
          label: 'Contacted',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'in_progress':
        return {
          icon: <Clock className="w-3 h-3" />,
          label: 'In Progress',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'closed':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Closed',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          icon: <User className="w-3 h-3" />,
          label: 'Claimed',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

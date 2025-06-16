
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Clock, CheckCircle, XCircle } from 'lucide-react';

interface EnhancedStatusBadgeProps {
  status: string;
  siteType: string;
  isClaimed: boolean;
  followUpStatus?: string;
  viewCount?: number;
  lastViewed?: string;
}

export const EnhancedStatusBadge: React.FC<EnhancedStatusBadgeProps> = ({
  status,
  siteType,
  isClaimed,
  followUpStatus,
  viewCount = 0,
  lastViewed
}) => {
  const getStatusConfig = () => {
    if (siteType === 'demo') {
      if (isClaimed) {
        switch (followUpStatus) {
          case 'contacted':
            return {
              variant: 'default' as const,
              className: 'bg-blue-100 text-blue-800 border-blue-200',
              icon: <User className="w-3 h-3" />,
              label: 'Contacted'
            };
          case 'in_progress':
            return {
              variant: 'default' as const,
              className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              icon: <Clock className="w-3 h-3" />,
              label: 'In Progress'
            };
          case 'closed':
            return {
              variant: 'default' as const,
              className: 'bg-green-100 text-green-800 border-green-200',
              icon: <CheckCircle className="w-3 h-3" />,
              label: 'Converted'
            };
          default:
            return {
              variant: 'default' as const,
              className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              icon: <User className="w-3 h-3" />,
              label: 'Claimed'
            };
        }
      } else {
        if (status === 'published') {
          return {
            variant: 'default' as const,
            className: 'bg-purple-100 text-purple-800 border-purple-200',
            icon: <Eye className="w-3 h-3" />,
            label: 'Ready to Share'
          };
        } else {
          return {
            variant: 'secondary' as const,
            className: 'bg-gray-100 text-gray-600 border-gray-200',
            icon: <Clock className="w-3 h-3" />,
            label: 'Draft'
          };
        }
      }
    } else {
      // Live site
      if (status === 'published') {
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Live'
        };
      } else {
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-600 border-gray-200',
          icon: <Clock className="w-3 h-3" />,
          label: 'Draft'
        };
      }
    }
  };

  const config = getStatusConfig();

  const formatLastViewed = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just viewed';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge 
        variant={config.variant}
        className={`flex items-center gap-1 ${config.className}`}
      >
        {config.icon}
        {config.label}
      </Badge>
      
      {siteType === 'demo' && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {viewCount}
            </span>
          )}
          {lastViewed && (
            <span>{formatLastViewed(lastViewed)}</span>
          )}
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { User, Mail, Phone, Building, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedProspectInfoProps {
  prospectName: string | null;
  prospectEmail: string | null;
  businessName?: string;
  businessDetails?: string;
  phone?: string;
  claimedAt?: string;
  message?: string;
}

export const EnhancedProspectInfo: React.FC<EnhancedProspectInfoProps> = ({
  prospectName,
  prospectEmail,
  businessName,
  businessDetails,
  phone,
  claimedAt,
  message
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!prospectName && !prospectEmail) {
    return <span className="text-gray-400 text-sm">No prospect claimed</span>;
  }

  const formatClaimedDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasAdditionalInfo = businessName || businessDetails || phone || message;

  return (
    <div className="space-y-2">
      {/* Basic Info - Always Visible */}
      <div className="space-y-1">
        {prospectName && (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="truncate">{prospectName}</span>
          </div>
        )}
        {prospectEmail && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="truncate">{prospectEmail}</span>
          </div>
        )}
        {claimedAt && (
          <div className="text-xs text-gray-500">
            Claimed {formatClaimedDate(claimedAt)}
          </div>
        )}
      </div>

      {/* Expandable Additional Info */}
      {hasAdditionalInfo && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-auto p-1 text-xs text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Less details
              </>
            ) : (
              <>
                <ChevronRight className="w-3 h-3 mr-1" />
                More details
              </>
            )}
          </Button>

          {expanded && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-100">
              {businessName && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Building className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{businessName}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
              {businessDetails && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Business:</span>
                  <p className="mt-1 text-gray-500">{businessDetails}</p>
                </div>
              )}
              {message && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Message:</span>
                  <p className="mt-1 text-gray-500 italic">"{message}"</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};


import React from 'react';
import { User, Mail } from 'lucide-react';

interface ProspectInfoProps {
  prospectName: string | null;
  prospectEmail: string | null;
}

export const ProspectInfo: React.FC<ProspectInfoProps> = ({
  prospectName,
  prospectEmail
}) => {
  if (!prospectName && !prospectEmail) {
    return <span className="text-gray-400">No prospect</span>;
  }

  return (
    <div className="space-y-1">
      {prospectName && (
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
          <User className="w-3 h-3 text-gray-500" />
          {prospectName}
        </div>
      )}
      {prospectEmail && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Mail className="w-3 h-3 text-gray-500" />
          {prospectEmail}
        </div>
      )}
    </div>
  );
};

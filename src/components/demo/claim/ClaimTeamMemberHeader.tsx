
import React from 'react';

interface ClaimTeamMemberHeaderProps {
  imageError: boolean;
  setImageError: (error: boolean) => void;
}

export const ClaimTeamMemberHeader: React.FC<ClaimTeamMemberHeaderProps> = ({
  imageError,
  setImageError
}) => {
  return (
    <div className="text-center mb-6 pb-4 border-b border-gray-100">
      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
        {!imageError ? (
          <img 
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=80&h=80&fit=crop&crop=face"
            alt="Jessica - Client Success Team"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-white text-xl font-semibold">J</div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Jessica</h3>
      <p className="text-sm text-gray-600 font-medium">Client Success Team</p>
    </div>
  );
};

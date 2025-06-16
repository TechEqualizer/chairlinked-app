
import React from 'react';
import { ChevronRight, Home, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorBreadcrumbProps {
  businessName: string;
  siteType: string;
}

export const EditorBreadcrumb: React.FC<EditorBreadcrumbProps> = ({
  businessName,
  siteType
}) => {
  return (
    <nav className="flex items-center text-sm text-gray-600 mb-2">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 mx-2" />
      <div className="flex items-center gap-1 text-gray-900">
        <Edit className="w-4 h-4" />
        Content Editor
      </div>
      {businessName && (
        <>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium">{businessName}</span>
          {siteType === 'live' && (
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
              Live
            </span>
          )}
        </>
      )}
    </nav>
  );
};

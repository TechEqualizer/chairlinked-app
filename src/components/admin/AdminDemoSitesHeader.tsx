
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { DemoExpirationSelector } from '@/components/demo/DemoExpirationSelector';

interface AdminDemoSitesHeaderProps {
  showCleanupSection: boolean;
  onToggleCleanupSection: () => void;
  onCreateNewDemo: () => void;
  selectedExpiration: number;
  onExpirationChange: (hours: number) => void;
}

export const AdminDemoSitesHeader: React.FC<AdminDemoSitesHeaderProps> = ({
  showCleanupSection,
  onToggleCleanupSection,
  onCreateNewDemo,
  selectedExpiration,
  onExpirationChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Demo Sites Management
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showCleanupSection ? "default" : "outline"}
            onClick={onToggleCleanupSection}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Cleanup Tools
          </Button>
          
          <Button
            onClick={onCreateNewDemo}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Plus size={16} />
            Create New Demo
          </Button>
        </div>
      </div>

      {/* Expiration Selector */}
      <div className="bg-white rounded-lg border p-4">
        <div className="max-w-xs">
          <DemoExpirationSelector
            value={selectedExpiration}
            onChange={onExpirationChange}
          />
          <p className="text-sm text-gray-500 mt-2">
            This expiration time will be applied to new demos created from this page.
          </p>
        </div>
      </div>
    </div>
  );
};

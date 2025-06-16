
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Users, 
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface QuickActionsPanelProps {
  onCreateDemo: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  selectedCount: number;
  onBulkAssign?: () => void;
  onExportData?: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onCreateDemo,
  onRefresh,
  isRefreshing,
  selectedCount,
  onBulkAssign,
  onExportData
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* Left side - Main actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateDemo}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Demo
        </Button>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-gray-300"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">
              {selectedCount} selected
            </span>
            {onBulkAssign && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkAssign}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Users className="w-3 h-3 mr-1" />
                Assign
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right side - Secondary actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          title="View Analytics"
          className="text-gray-500 hover:text-gray-700"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>

        {onExportData && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportData}
            title="Export Data"
            className="text-gray-500 hover:text-gray-700"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

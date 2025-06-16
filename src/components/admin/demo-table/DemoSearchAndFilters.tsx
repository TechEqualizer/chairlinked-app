
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2 } from "lucide-react";
import { BulkLifecycleActions } from "../unified-sites/BulkLifecycleActions";
import { LIFECYCLE_STAGE_CONFIG } from "@/types/siteLifecycle";

interface DemoSearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  selectedSites: Set<string>;
  onBulkDelete: () => void;
  isLoading: boolean;
  onBulkTransitionComplete?: () => void;
}

export const DemoSearchAndFilters: React.FC<DemoSearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedSites,
  onBulkDelete,
  isLoading,
  onBulkTransitionComplete
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white items-center">
      <div className="flex-1 relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by business name or prospect..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sites</SelectItem>
          <SelectItem value="demo">Type: Demo</SelectItem>
          <SelectItem value="live">Type: Live</SelectItem>
          <SelectItem value="claimed">Prospect: Claimed</SelectItem>
          <SelectItem value="unclaimed">Prospect: Unclaimed</SelectItem>
          {Object.entries(LIFECYCLE_STAGE_CONFIG).map(([stage, config]) => (
            <SelectItem key={stage} value={stage}>
              Stage: {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSites.size > 0 && (
        <div className="flex items-center gap-2">
           {onBulkTransitionComplete && (
            <BulkLifecycleActions
              selectedSiteIds={Array.from(selectedSites)}
              onTransitionComplete={onBulkTransitionComplete}
            />
          )}
          <Button
            onClick={onBulkDelete}
            disabled={isLoading}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedSites.size})
          </Button>
        </div>
      )}
    </div>
  );
};

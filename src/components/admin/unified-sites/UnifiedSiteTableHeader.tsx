
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface UnifiedSiteTableHeaderProps {
  selectedSites: Set<string>;
  filteredSitesLength: number;
  onToggleSelectAll: () => void;
}

export const UnifiedSiteTableHeader: React.FC<UnifiedSiteTableHeaderProps> = ({
  selectedSites,
  filteredSitesLength,
  onToggleSelectAll
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={selectedSites.size === filteredSitesLength && filteredSitesLength > 0}
            onCheckedChange={onToggleSelectAll}
            aria-label="Select all sites"
          />
        </TableHead>
        <TableHead>Site Details</TableHead>
        <TableHead>Prospect Info</TableHead>
        <TableHead>Activity</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};


import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface DemoTableHeaderProps {
  selectedSites: Set<string>;
  filteredSitesLength: number;
  onToggleSelectAll: () => void;
}

export const DemoTableHeader: React.FC<DemoTableHeaderProps> = ({
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
          />
        </TableHead>
        <TableHead>Business Name & URL</TableHead>
        <TableHead>Prospect Name</TableHead>
        <TableHead>Prospect Email</TableHead>
        <TableHead>Last Updated</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

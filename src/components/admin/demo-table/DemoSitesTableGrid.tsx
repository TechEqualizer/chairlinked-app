
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { DemoTableHeader } from "./DemoTableHeader";
import { DemoTableRow } from "./DemoTableRow";
import { DemoSite } from "./useDemoSitesTable";

interface DemoSitesTableGridProps {
  filteredSites: DemoSite[];
  isLoading: boolean;
  selectedSites: Set<string>;
  toggleSiteSelection: (siteId: string) => void;
  toggleSelectAll: () => void;
  onEdit: (siteId: string) => void;
  onDeleteClick: (site: DemoSite) => void;
  onConvertToDemo?: (siteId: string) => void;
  onDuplicate?: (siteId: string) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  onCreateTemplate: (site: DemoSite) => void;
}

export const DemoSitesTableGrid: React.FC<DemoSitesTableGridProps> = ({
  filteredSites,
  isLoading,
  selectedSites,
  toggleSiteSelection,
  toggleSelectAll,
  onEdit,
  onDeleteClick,
  onConvertToDemo,
  onDuplicate,
  onPublish,
  onConvertToLive,
  onCreateTemplate,
}) => (
  <div className="bg-white rounded-2xl border border-zinc-100 overflow-x-auto shadow-none">
    <Table>
      <DemoTableHeader
        selectedSites={selectedSites}
        filteredSitesLength={filteredSites.length}
        onToggleSelectAll={toggleSelectAll}
      />
      <TableBody>
        {filteredSites.map((site) => (
          <DemoTableRow
            key={site.id}
            site={site}
            isLoading={isLoading}
            selectedSites={selectedSites}
            onToggleSiteSelection={toggleSiteSelection}
            onConvertToDemo={onConvertToDemo}
            onCreateTemplate={onCreateTemplate}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
            onDeleteClick={onDeleteClick}
            onPublish={onPublish}
            onConvertToLive={onConvertToLive}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

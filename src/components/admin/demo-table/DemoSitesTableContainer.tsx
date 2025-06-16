
import React from "react";
import { DemoSitesTableSearch } from "./DemoSitesTableSearch";
import { DemoSitesTableGrid } from "./DemoSitesTableGrid";
import { DemoSitesTableEmptyState } from "./DemoSitesTableEmptyState";
import CreateTemplateModal from "../CreateTemplateModal";
import ConfirmDialog from "../../chairlinked/editing/ConfirmDialog";
import { useDemoSitesTable, DemoSite } from "./useDemoSitesTable";
import { DemoSitesTableSkeleton } from "./DemoSitesTableSkeleton";

interface DemoSitesTableContainerProps {
  demoSites: DemoSite[];
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onBulkDelete?: (siteIds: string[]) => void;
  onConvertToDemo?: (siteId: string) => void;
  onDuplicate?: (siteId: string) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  isLoading?: boolean;
  onTemplateCreated?: () => void;
}

export const DemoSitesTableContainer: React.FC<DemoSitesTableContainerProps> = ({
  demoSites,
  onEdit,
  onDelete,
  onBulkDelete,
  onConvertToDemo,
  onDuplicate,
  onPublish,
  onConvertToLive,
  isLoading = false,
  onTemplateCreated
}) => {
  const table = useDemoSitesTable({
    demoSites,
    onDelete,
    onBulkDelete,
    isLoading,
    onTemplateCreated,
  });

  return (
    <div className="space-y-4">
      <DemoSitesTableSearch
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
        selectedCount={table.selectedSites.size}
        onBulkDelete={table.handleBulkDelete}
        isLoading={isLoading}
      />
      
      {isLoading ? (
        <DemoSitesTableSkeleton />
      ) : table.filteredSites.length === 0 ? (
        <DemoSitesTableEmptyState />
      ) : (
        <DemoSitesTableGrid
          filteredSites={table.filteredSites}
          isLoading={isLoading}
          selectedSites={table.selectedSites}
          toggleSiteSelection={table.toggleSiteSelection}
          toggleSelectAll={table.toggleSelectAll}
          onEdit={onEdit}
          onDeleteClick={table.handleDeleteClick}
          onConvertToDemo={onConvertToDemo}
          onDuplicate={onDuplicate}
          onPublish={onPublish}
          onConvertToLive={onConvertToLive}
          onCreateTemplate={table.handleCreateTemplate}
        />
      )}

      {table.selectedDemoForTemplate && table.selectedDemoForTemplate.generated_config && (
        <CreateTemplateModal
          isOpen={table.templateModalOpen}
          onClose={() => {
            table.setTemplateModalOpen(false);
            table.setSelectedDemoForTemplate(null);
          }}
          demoSite={{
            id: table.selectedDemoForTemplate.id,
            business_name: table.selectedDemoForTemplate.business_name,
            generated_config: table.selectedDemoForTemplate.generated_config
          }}
          onSuccess={table.handleTemplateCreated}
        />
      )}
      <ConfirmDialog
        isOpen={table.deleteConfirmOpen}
        onClose={table.handleDeleteCancel}
        onConfirm={table.handleDeleteConfirm}
        title="Delete Demo Site"
        message={`Are you sure you want to delete "${table.siteToDelete?.business_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

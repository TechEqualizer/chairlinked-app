
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import CreateTemplateModal from "./CreateTemplateModal";
import ConfirmDialog from "../chairlinked/editing/ConfirmDialog";
import { DemoSearchAndFilters } from "./demo-table/DemoSearchAndFilters";
import { UnifiedSiteTableHeader } from "./unified-sites/UnifiedSiteTableHeader";
import { QuickActionsPanel } from "./demo-table/QuickActionsPanel";
import { useUnifiedSitesTable, Site } from "./useUnifiedSitesTable";
import { EnhancedUnifiedSiteTableRow } from "./unified-sites/EnhancedUnifiedSiteTableRow";
import { SiteWithLifecycle } from "@/types/siteLifecycle";

interface UnifiedSitesTableProps {
  sites: SiteWithLifecycle[];
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onConvertToDemo?: (siteId: string) => void;
  onDuplicate?: (siteId: string) => void;
  onBulkDelete?: (siteIds: string[]) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  isLoading?: boolean;
  onTemplateCreated?: () => void;
  onCreateDemo?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const UnifiedSitesTable: React.FC<UnifiedSitesTableProps> = ({
  sites,
  onEdit,
  onDelete,
  onConvertToDemo,
  onDuplicate,
  onBulkDelete,
  onPublish,
  onConvertToLive,
  isLoading = false,
  onTemplateCreated,
  onCreateDemo,
  onRefresh,
  isRefreshing = false
}) => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    templateModalOpen,
    setTemplateModalOpen,
    selectedSiteForTemplate,
    setSelectedSiteForTemplate,
    selectedSites,
    deleteConfirmOpen,
    siteToDelete,
    filteredSites,
    handleCreateTemplate,
    handleTemplateCreated,
    toggleSiteSelection,
    toggleSelectAll,
    handleBulkDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleExportData,
  } = useUnifiedSitesTable({ sites: sites as Site[], onDelete, onBulkDelete, onTemplateCreated });

  return (
    <div className="space-y-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Quick Actions Panel */}
      {onCreateDemo && (
        <QuickActionsPanel
          onCreateDemo={onCreateDemo}
          onRefresh={onRefresh || (() => {})}
          isRefreshing={isRefreshing}
          selectedCount={selectedSites.size}
          onExportData={handleExportData}
        />
      )}

      {/* Search and Filters */}
      <div className="border-b border-gray-200">
        <DemoSearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedSites={selectedSites}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
          onBulkTransitionComplete={onRefresh}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <UnifiedSiteTableHeader
            selectedSites={selectedSites}
            filteredSitesLength={filteredSites.length}
            onToggleSelectAll={toggleSelectAll}
          />
          <TableBody>
            {(filteredSites as SiteWithLifecycle[]).map((site) => (
              <EnhancedUnifiedSiteTableRow
                key={site.id}
                site={site}
                isLoading={isLoading}
                selectedSites={selectedSites}
                onToggleSiteSelection={toggleSiteSelection}
                onConvertToDemo={onConvertToDemo}
                onCreateTemplate={handleCreateTemplate as (site: SiteWithLifecycle) => void}
                onDuplicate={onDuplicate}
                onEdit={onEdit}
                onDeleteClick={handleDeleteClick as (site: SiteWithLifecycle) => void}
                onPublish={onPublish}
                onConvertToLive={onConvertToLive}
                onTransitionComplete={onRefresh}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sites found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedSiteForTemplate && selectedSiteForTemplate.generated_config && (
        <CreateTemplateModal
          isOpen={templateModalOpen}
          onClose={() => {
            setTemplateModalOpen(false);
            setSelectedSiteForTemplate(null);
          }}
          demoSite={{
            id: selectedSiteForTemplate.id,
            business_name: selectedSiteForTemplate.business_name,
            generated_config: selectedSiteForTemplate.generated_config
          }}
          onSuccess={handleTemplateCreated}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Site"
        message={`Are you sure you want to delete "${siteToDelete?.business_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

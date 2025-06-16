
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { AdminSiteTableRow } from './AdminSiteTableRow';

interface AdminSitesTableProps {
  filteredSites: SiteWithLifecycle[];
  selectedSites: Set<string>;
  onToggleSelection: (siteId: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  onTemplateCreated?: () => void;
  onLifecycleTransition?: () => void;
}

export const AdminSitesTable: React.FC<AdminSitesTableProps> = ({
  filteredSites,
  selectedSites,
  onToggleSelection,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onPublish,
  onConvertToLive,
  onTemplateCreated,
  onLifecycleTransition
}) => {
  const allSelected = filteredSites.length > 0 && filteredSites.every(site => selectedSites.has(site.id));
  const someSelected = filteredSites.some(site => selectedSites.has(site.id));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleSelectAll}
                className={`border-gray-300 ${someSelected && !allSelected ? 'data-[state=checked]:bg-blue-500 opacity-50' : ''}`}
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Business</TableHead>
            <TableHead className="font-semibold text-gray-900">Stage</TableHead>
            <TableHead className="font-semibold text-gray-900">Prospect</TableHead>
            <TableHead className="font-semibold text-gray-900">Activity</TableHead>
            <TableHead className="font-semibold text-gray-900">Actions</TableHead>
            <TableHead className="font-semibold text-gray-900">Stage Management</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSites.map((site) => (
            <AdminSiteTableRow
              key={site.id}
              site={site}
              isSelected={selectedSites.has(site.id)}
              onToggleSelection={onToggleSelection}
              onEdit={onEdit}
              onDelete={onDelete}
              onTemplateCreated={onTemplateCreated}
              onLifecycleTransition={onLifecycleTransition}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

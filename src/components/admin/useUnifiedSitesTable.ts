import { useState, useMemo } from 'react';
import { SiteWithLifecycle } from '@/types/siteLifecycle';

export type Site = SiteWithLifecycle;

interface UseUnifiedSitesTableProps {
  sites: Site[];
  onDelete: (siteId: string) => void;
  onBulkDelete?: (siteIds: string[]) => void;
  onTemplateCreated?: () => void;
}

export const useUnifiedSitesTable = ({
  sites,
  onDelete,
  onBulkDelete,
  onTemplateCreated,
}: UseUnifiedSitesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedSiteForTemplate, setSelectedSiteForTemplate] = useState<Site | null>(null);
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  const filteredSites = useMemo(() => sites.filter(site => {
    const matchesSearch = site.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (site.prospect_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (site.prospect_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    let matchesStatus = true;
    if (statusFilter === "claimed") {
      matchesStatus = !!(site.prospect_name || site.prospect_email);
    } else if (statusFilter === "unclaimed") {
      matchesStatus = !(site.prospect_name || site.prospect_email);
    } else if (statusFilter === "demo") {
      matchesStatus = site.site_type === 'demo';
    } else if (statusFilter === "live") {
      matchesStatus = site.site_type === 'live';
    } else if (statusFilter !== "all") {
      matchesStatus = site.lifecycle_stage === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  }), [sites, searchTerm, statusFilter]);

  const handleCreateTemplate = (site: Site) => {
    if (!site.generated_config) {
      console.warn('Cannot create template: Site has no generated configuration');
      return;
    }
    setSelectedSiteForTemplate(site);
    setTemplateModalOpen(true);
  };

  const handleTemplateCreated = () => {
    setTemplateModalOpen(false);
    setSelectedSiteForTemplate(null);
    onTemplateCreated?.();
  };

  const toggleSiteSelection = (siteId: string) => {
    const newSelected = new Set(selectedSites);
    if (newSelected.has(siteId)) {
      newSelected.delete(siteId);
    } else {
      newSelected.add(siteId);
    }
    setSelectedSites(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedSites.size === filteredSites.length) {
      setSelectedSites(new Set());
    } else {
      setSelectedSites(new Set(filteredSites.map(site => site.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedSites.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedSites.size} selected site${selectedSites.size > 1 ? 's' : ''}?`)) {
      onBulkDelete?.(Array.from(selectedSites));
      setSelectedSites(new Set());
    }
  };

  const handleDeleteClick = (site: Site) => {
    setSiteToDelete(site);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (siteToDelete) {
      onDelete(siteToDelete.id);
      setDeleteConfirmOpen(false);
      setSiteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setSiteToDelete(null);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Business Name', 'Status', 'Lifecycle Stage', 'Type', 'Prospect Name', 'Prospect Email', 'Created', 'URL'].join(','),
      ...filteredSites.map(site => [
        site.business_name,
        site.status,
        site.lifecycle_stage,
        site.site_type || 'live',
        site.prospect_name || '',
        site.prospect_email || '',
        new Date(site.created_at).toLocaleDateString(),
        `chairlinked.com/${site.site_type === 'demo' ? 'demo/' : ''}${site.site_slug}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chairlinked-sites-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return {
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
  };
};

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export interface DemoSite {
  id: string;
  business_name: string;
  site_slug: string;
  prospect_name: string | null;
  prospect_email: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  site_type?: string;
  generated_config?: any;
  follow_up_status?: string;
}

interface UseDemoSitesTableProps {
  demoSites: DemoSite[];
  onDelete: (siteId: string) => void;
  onBulkDelete?: (siteIds: string[]) => void;
  isLoading?: boolean;
  onTemplateCreated?: () => void;
}

export const useDemoSitesTable = ({
  demoSites,
  onDelete,
  onBulkDelete,
  isLoading = false,
  onTemplateCreated,
}: UseDemoSitesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<DemoSite | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedDemoForTemplate, setSelectedDemoForTemplate] = useState<DemoSite | null>(null);

  const filteredSites = useMemo(() => {
    return demoSites.filter(site => {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        site.business_name.toLowerCase().includes(lowercasedTerm) ||
        (site.prospect_name?.toLowerCase().includes(lowercasedTerm) || false) ||
        (site.prospect_email?.toLowerCase().includes(lowercasedTerm) || false);
      return matchesSearch;
    });
  }, [demoSites, debouncedSearchTerm]);

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSites(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(siteId)) {
        newSelected.delete(siteId);
      } else {
        newSelected.add(siteId);
      }
      return newSelected;
    });
  };

  const toggleSelectAll = () => {
    setSelectedSites(prev => {
      if (prev.size === filteredSites.length) return new Set();
      return new Set(filteredSites.map(site => site.id));
    });
  };

  const handleBulkDelete = () => {
    if (!onBulkDelete || selectedSites.size === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedSites.size} selected demo site${selectedSites.size > 1 ? "s" : ""}?`
      )
    ) {
      onBulkDelete(Array.from(selectedSites));
      setSelectedSites(new Set());
    }
  };

  const handleDeleteClick = (site: DemoSite) => {
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

  const handleCreateTemplate = (site: DemoSite) => {
    if (!site.generated_config) return;
    setSelectedDemoForTemplate(site);
    setTemplateModalOpen(true);
  };

  const handleTemplateCreated = () => {
    setSelectedDemoForTemplate(null);
    onTemplateCreated?.();
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredSites,
    selectedSites,
    toggleSiteSelection,
    toggleSelectAll,
    handleBulkDelete,
    deleteConfirmOpen,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    siteToDelete,
    templateModalOpen,
    selectedDemoForTemplate,
    handleCreateTemplate,
    handleTemplateCreated,
    setTemplateModalOpen,
    setSelectedDemoForTemplate
  };
};

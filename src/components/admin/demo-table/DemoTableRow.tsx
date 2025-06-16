import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DemoActionButtons } from "./DemoActionButtons";
import { SiteUrlDisplay } from "../SiteUrlDisplay";
import { ClaimStatusBadge } from "./ClaimStatusBadge";
import { ContactProspectButton } from "./ContactProspectButton";
import { FollowUpStatusDropdown } from "./FollowUpStatusDropdown";
import { ProspectInfo } from "./ProspectInfo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DemoSite {
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

interface DemoTableRowProps {
  site: DemoSite;
  isLoading: boolean;
  selectedSites: Set<string>;
  onToggleSiteSelection: (siteId: string) => void;
  onConvertToDemo?: (siteId: string) => void;
  onCreateTemplate: (site: DemoSite) => void;
  onDuplicate?: (siteId: string) => void;
  onEdit: (siteId: string) => void;
  onDeleteClick: (site: DemoSite) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
}

export const DemoTableRow: React.FC<DemoTableRowProps> = ({
  site,
  isLoading,
  selectedSites,
  onToggleSiteSelection,
  onConvertToDemo,
  onCreateTemplate,
  onDuplicate,
  onEdit,
  onDeleteClick,
  onPublish,
  onConvertToLive
}) => {
  const { toast } = useToast();
  const [followUpStatus, setFollowUpStatus] = useState(site.follow_up_status || 'new');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isClaimed = !!(site.prospect_name || site.prospect_email);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!isClaimed) return;

    setIsUpdatingStatus(true);
    try {
      // Update the demo_prospect_leads table
      const { error } = await supabase
        .from('demo_prospect_leads')
        .update({ follow_up_status: newStatus })
        .eq('demo_site_id', site.id);

      if (error) throw error;

      setFollowUpStatus(newStatus);
      toast({
        title: "Status updated",
        description: `Follow-up status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating follow-up status:', error);
      toast({
        title: "Error",
        description: "Failed to update follow-up status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const rowClassName = isClaimed 
    ? "hover:bg-green-50/70 border-l-4 border-l-green-500 transition-colors duration-200" 
    : "hover:bg-gray-50/70 transition-colors duration-200";

  return (
    <TableRow className={rowClassName}>
      <TableCell className="w-12">
        <Checkbox
          checked={selectedSites.has(site.id)}
          onCheckedChange={() => onToggleSiteSelection(site.id)}
        />
      </TableCell>
      
      <TableCell className="font-medium">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {site.business_name}
            </span>
            <ClaimStatusBadge 
              isClaimed={isClaimed} 
              followUpStatus={followUpStatus}
            />
          </div>
          <SiteUrlDisplay site={site} />
        </div>
      </TableCell>

      <TableCell>
        {site.prospect_name || <span className="text-gray-400">-</span>}
      </TableCell>
      
      <TableCell>
        {site.prospect_email || <span className="text-gray-400">-</span>}
      </TableCell>
      
      <TableCell className="text-sm text-gray-500">
        {formatDate(site.updated_at)}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2 flex-wrap">
          {isClaimed && (
            <>
              <ContactProspectButton
                prospectEmail={site.prospect_email!}
                prospectName={site.prospect_name || 'there'}
                businessName={site.business_name}
              />
              <FollowUpStatusDropdown
                currentStatus={followUpStatus}
                onStatusChange={handleStatusChange}
                disabled={isUpdatingStatus}
              />
            </>
          )}
          <DemoActionButtons
            site={site}
            isLoading={isLoading}
            onConvertToDemo={onConvertToDemo}
            onCreateTemplate={onCreateTemplate}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
            onDeleteClick={onDeleteClick}
            onPublish={onPublish}
            onConvertToLive={onConvertToLive}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

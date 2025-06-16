import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { UnifiedSiteActionButtons } from "./UnifiedSiteActionButtons";
import { SiteUrlDisplay } from "../SiteUrlDisplay";
import { ContactProspectButton } from "../demo-table/ContactProspectButton";
import { FollowUpStatusDropdown } from "../demo-table/FollowUpStatusDropdown";
import { EnhancedProspectInfo } from "../demo-table/EnhancedProspectInfo";
import { LifecycleStageBadge } from "../lifecycle/LifecycleStageBadge";
import { LifecycleStageActions } from "../lifecycle/LifecycleStageActions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SiteWithLifecycle } from "@/types/siteLifecycle";
import { useAuthContext } from "@/components/auth/AuthProvider";

interface EnhancedUnifiedSiteTableRowProps {
  site: SiteWithLifecycle;
  isLoading: boolean;
  selectedSites: Set<string>;
  onToggleSiteSelection: (siteId: string) => void;
  onTransitionComplete?: () => void;
  onConvertToDemo?: (siteId: string) => void;
  onCreateTemplate: (site: SiteWithLifecycle) => void;
  onDuplicate?: (siteId: string) => void;
  onEdit: (siteId: string) => void;
  onDeleteClick: (site: SiteWithLifecycle) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
}

export const EnhancedUnifiedSiteTableRow: React.FC<EnhancedUnifiedSiteTableRowProps> = ({
  site,
  isLoading,
  selectedSites,
  onToggleSiteSelection,
  onTransitionComplete,
  onConvertToDemo,
  onCreateTemplate,
  onDuplicate,
  onEdit,
  onDeleteClick,
  onPublish,
  onConvertToLive
}) => {
  const { toast } = useToast();
  const { isAdmin } = useAuthContext();
  const [followUpStatus, setFollowUpStatus] = useState(site.follow_up_status || 'new');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isClaimed = !!(site.prospect_name || site.prospect_email);
  const isCustomerControlled = site.site_type === 'live' && site.status === 'published' && !!site.user_id;

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

  const getRowClassName = () => {
    if (isClaimed) {
      return "hover:bg-green-50 border-l-4 border-l-green-500 bg-green-25";
    }
    if (site.site_type === 'demo' && site.status === 'published') {
      return "hover:bg-purple-50 border-l-4 border-l-purple-300 bg-purple-25";
    }
    return "hover:bg-gray-50";
  };

  return (
    <TableRow className={getRowClassName()}>
      <TableCell className="w-12">
        <Checkbox
          checked={selectedSites.has(site.id)}
          onCheckedChange={() => onToggleSiteSelection(site.id)}
        />
      </TableCell>
      
      <TableCell className="font-medium">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900 text-base">
              {site.business_name}
            </span>
            <LifecycleStageBadge 
              stage={site.lifecycle_stage}
              size="sm"
            />
          </div>
          <SiteUrlDisplay site={site} />
        </div>
      </TableCell>
      
      <TableCell className="align-top">
        <EnhancedProspectInfo 
          prospectName={site.prospect_name}
          prospectEmail={site.prospect_email}
          businessName={site.business_name}
          businessDetails={undefined}
          phone={undefined}
          claimedAt={undefined}
          message={undefined}
        />
      </TableCell>
      
      <TableCell className="text-sm text-gray-500 align-top">
        <div className="space-y-1">
          <div>Updated: {formatDate(site.updated_at)}</div>
          <div className="text-xs">Created: {formatDate(site.created_at)}</div>
          {site.shared_at && (
            <div className="text-xs text-purple-600">Shared: {formatDate(site.shared_at)}</div>
          )}
          {site.payment_initiated_at && (
            <div className="text-xs text-yellow-600">Payment: {formatDate(site.payment_initiated_at)}</div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="align-top">
        <div className="space-y-3">
          {/* Lifecycle Actions */}
          <LifecycleStageActions
            site={site}
            onTransitionComplete={onTransitionComplete}
            isAdmin={isAdmin}
          />
          
          {/* Traditional Actions */}
          <div className="flex items-start gap-2 flex-wrap">
            {isClaimed && site.prospect_email && (
              <>
                <ContactProspectButton
                  prospectEmail={site.prospect_email}
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
            <UnifiedSiteActionButtons
              site={site}
              isLoading={isLoading}
              onConvertToDemo={onConvertToDemo}
              onCreateTemplate={onCreateTemplate}
              onDuplicate={onDuplicate}
              onEdit={onEdit}
              onDeleteClick={onDeleteClick}
              onPublish={onPublish}
              onConvertToLive={onConvertToLive}
              isCustomerControlled={isCustomerControlled}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

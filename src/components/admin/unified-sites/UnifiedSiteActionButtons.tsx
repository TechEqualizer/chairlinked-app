
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, FileText, Trash2, Globe, ArrowRight, Edit, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Site {
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
  user_id?: string;
}

interface UnifiedSiteActionButtonsProps {
  site: Site;
  isLoading: boolean;
  onConvertToDemo?: (siteId: string) => void;
  onCreateTemplate: (site: Site) => void;
  onDuplicate?: (siteId: string) => void;
  onEdit: (siteId: string) => void;
  onDeleteClick: (site: Site) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  isCustomerControlled: boolean;
}

export const UnifiedSiteActionButtons: React.FC<UnifiedSiteActionButtonsProps> = ({
  site,
  isLoading,
  onConvertToDemo,
  onCreateTemplate,
  onDuplicate,
  onEdit,
  onDeleteClick,
  onPublish,
  onConvertToLive,
  isCustomerControlled
}) => {
  const [showEditWarning, setShowEditWarning] = useState(false);

  const handleEditClick = () => {
    if (isCustomerControlled) {
      setShowEditWarning(true);
    } else {
      onEdit(site.id);
    }
  };

  const handleConfirmEdit = () => {
    setShowEditWarning(false);
    onEdit(site.id);
  };

  return (
    <>
      {/* Show Convert to Demo button for non-demo sites */}
      {site.site_type !== 'demo' && onConvertToDemo && (
        <Button
          onClick={() => onConvertToDemo(site.id)}
          disabled={isLoading}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Convert to Demo
        </Button>
      )}

      {/* Show Publish button for draft sites */}
      {site.status === 'draft' && onPublish && (
        <Button
          onClick={() => onPublish(site.id)}
          disabled={isLoading}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Globe className="w-4 h-4 mr-1" />
          Publish
        </Button>
      )}

      {/* Show Convert to Live button for published demo sites */}
      {site.site_type === 'demo' && site.status === 'published' && onConvertToLive && (
        <Button
          onClick={() => onConvertToLive(site.id)}
          disabled={isLoading}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Convert to Live
        </Button>
      )}
      
      <Button
        onClick={() => onCreateTemplate(site)}
        disabled={isLoading || !site.generated_config}
        variant="outline"
        size="sm"
        className="border-gray-200"
        title={!site.generated_config ? "No configuration available for template creation" : "Save as Template"}
      >
        <FileText className="w-4 h-4 mr-1" />
        Save as Template
      </Button>

      {onDuplicate && (
        <Button
          onClick={() => onDuplicate(site.id)}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="border-gray-200"
        >
          <Copy className="w-4 h-4 mr-1" />
          Duplicate
        </Button>
      )}

      <Button
        onClick={handleEditClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className={`border-gray-200 ${isCustomerControlled ? 'text-amber-600 hover:text-amber-700' : 'text-blue-600 hover:text-blue-700'}`}
      >
        {isCustomerControlled ? (
          <>
            <Shield className="w-4 h-4 mr-1" />
            Edit (Protected)
          </>
        ) : (
          <>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </>
        )}
      </Button>

      <Button
        onClick={() => onDeleteClick(site)}
        disabled={isLoading || isCustomerControlled}
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
        title={isCustomerControlled ? "Cannot delete customer-controlled sites" : "Delete site"}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Edit Warning Dialog */}
      <Dialog open={showEditWarning} onOpenChange={setShowEditWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Edit Customer-Controlled Site
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                This site is controlled by the customer. They have full editing access through their dashboard.
              </p>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Consider contacting the customer before making changes, as they may have unsaved work or specific preferences.
                </AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditWarning(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmEdit} className="bg-amber-600 hover:bg-amber-700">
              Edit Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

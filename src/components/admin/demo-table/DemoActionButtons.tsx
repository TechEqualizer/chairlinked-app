
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, FileText, Trash2, Globe, ArrowRight } from "lucide-react";

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
}

interface DemoActionButtonsProps {
  site: DemoSite;
  isLoading: boolean;
  onConvertToDemo?: (siteId: string) => void;
  onCreateTemplate: (site: DemoSite) => void;
  onDuplicate?: (siteId: string) => void;
  onEdit: (siteId: string) => void;
  onDeleteClick: (site: DemoSite) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
}

export const DemoActionButtons: React.FC<DemoActionButtonsProps> = ({
  site,
  isLoading,
  onConvertToDemo,
  onCreateTemplate,
  onDuplicate,
  onEdit,
  onDeleteClick,
  onPublish,
  onConvertToLive
}) => {
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
      <button
        onClick={() => onEdit(site.id)}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1"
      >
        Edit
      </button>
      <Button
        onClick={() => onDeleteClick(site)}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  );
};

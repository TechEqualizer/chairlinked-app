import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy, 
  User, 
  Mail,
  Clock,
  Eye,
  MoreVertical,
  Star,
  Globe
} from 'lucide-react';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { LifecycleStageBadge } from '@/components/admin/lifecycle/LifecycleStageBadge';
import { LifecycleStageActions } from '@/components/admin/lifecycle/LifecycleStageActions';
import { useToast } from '@/hooks/use-toast';
import { generateShareableUrl, generateAdminPreviewUrl } from '@/utils/urlGenerator';

interface AdminSiteTableRowProps {
  site: SiteWithLifecycle;
  isSelected: boolean;
  onToggleSelection: (siteId: string) => void;
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
  onTemplateCreated?: () => void;
  onLifecycleTransition?: () => void;
}

export const AdminSiteTableRow: React.FC<AdminSiteTableRowProps> = ({
  site,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onTemplateCreated,
  onLifecycleTransition,
}) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Site URL copied to clipboard",
    });
  };

  const getSiteConfig = () => ({
    slug: site.site_slug,
    siteType: (site.site_type as 'demo' | 'live') || 'live',
    status: site.status as 'draft' | 'published'
  });

  const siteUrl = generateShareableUrl(getSiteConfig());
  const adminUrl = generateAdminPreviewUrl(getSiteConfig());

  return (
    <TableRow className="hover:bg-gray-50/50 border-b border-gray-50">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(site.id)}
          className="border-gray-300"
        />
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{site.business_name}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="w-3.5 h-3.5" />
            <a 
              href={siteUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              {site.site_slug}
              <ExternalLink className="w-3 h-3" />
            </a>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600" 
              onClick={() => copyToClipboard(siteUrl)}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <LifecycleStageBadge stage={site.lifecycle_stage} />
      </TableCell>
      
      <TableCell>
        {site.prospect_name || site.prospect_email ? (
          <div className="space-y-1">
            {site.prospect_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-3.5 h-3.5 text-green-600" />
                <span className="font-medium text-gray-700">{site.prospect_name}</span>
              </div>
            )}
            {site.prospect_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-green-600" />
                <span className="text-gray-600">{site.prospect_email}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">No prospect assigned</span>
        )}
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5"/>
            <span>Updated {formatDate(site.updated_at)}</span>
          </div>
          {site.demo_view_count !== undefined && site.demo_view_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{site.demo_view_count} views</span>
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(site.id)}
            className="h-8 px-3"
          >
            <Edit className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
          {onTemplateCreated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTemplateCreated}
              className="h-8 px-3"
            >
              <Star className="w-3.5 h-3.5 mr-1" />
              Template
            </Button>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <LifecycleStageActions
          site={site}
          onTransitionComplete={onLifecycleTransition}
          isAdmin={true}
        />
      </TableCell>
      
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem onClick={() => onEdit(site.id)} className="text-sm">
              <Edit className="mr-2 h-4 w-4" /> Edit Site
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => window.open(adminUrl, '_blank')} className="text-sm">
              <Eye className="mr-2 h-4 w-4" /> Preview as Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(site.id)} className="text-sm text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

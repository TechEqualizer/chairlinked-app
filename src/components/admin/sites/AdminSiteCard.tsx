import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { LifecycleStageBadge } from '@/components/admin/lifecycle/LifecycleStageBadge';
import { LifecycleStageActions } from '@/components/admin/lifecycle/LifecycleStageActions';
import { useToast } from '@/hooks/use-toast';
import { generateShareableUrl, generateAdminPreviewUrl } from '@/utils/urlGenerator';

interface AdminSiteCardProps {
  site: SiteWithLifecycle;
  isSelected: boolean;
  onToggleSelection: (siteId: string) => void;
  onEdit: (siteId:string) => void;
  onDelete: (siteId: string) => void;
  onPublish?: (siteId: string) => void;
  onConvertToLive?: (siteId: string) => void;
  onTemplateCreated?: () => void;
}

export const AdminSiteCard: React.FC<AdminSiteCardProps> = ({
  site,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onPublish,
  onConvertToLive,
  onTemplateCreated
}) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
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

  const handleCreateTemplate = () => {
    if (onTemplateCreated) {
        onTemplateCreated();
    }
  }

  const handleLifecycleTransition = () => {
    // Optionally trigger a refresh or update
    toast({
      title: "Stage Updated",
      description: "Site lifecycle stage has been updated successfully.",
    });
  };

  const isCustomerControlled = site.lifecycle_stage === 'customer_controlled';
  const hasProspect = site.prospect_name || site.prospect_email;
  
  return (
    <Card className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      {/* Selection Checkbox - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(site.id)}
          className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      </div>

      {/* Actions Menu - Top Right */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem onClick={() => onEdit(site.id)} className="text-sm">
              <Edit className="mr-2 h-4 w-4" /> Edit Site
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(adminUrl, '_blank')} className="text-sm">
              <Eye className="mr-2 h-4 w-4" /> Preview as Admin
            </DropdownMenuItem>
            {onTemplateCreated && (
              <DropdownMenuItem onClick={handleCreateTemplate} className="text-sm">
                <Star className="mr-2 h-4 w-4" /> Save as Template
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(site.id)} className="text-sm text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pb-3 pt-6">
        <div className="space-y-3">
          {/* Business Name & URL */}
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-base leading-tight pr-20">
              {site.business_name}
            </h3>
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

          {/* Lifecycle Stage */}
          <div className="flex items-center justify-between">
            <LifecycleStageBadge stage={site.lifecycle_stage} />
            {site.demo_view_count !== undefined && site.demo_view_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                <Eye className="w-3 h-3" />
                <span>{site.demo_view_count}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-0">
        {/* Prospect Information */}
        {hasProspect ? (
          <div className="space-y-2 p-3 bg-green-50/50 rounded-lg border border-green-100 mb-4">
            {site.prospect_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">{site.prospect_name}</span>
              </div>
            )}
            {site.prospect_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">{site.prospect_email}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-100 mb-4">
            <p className="text-sm text-gray-500 italic">No prospect assigned</p>
          </div>
        )}

        {/* Lifecycle Stage Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Stage Management:</h4>
          <LifecycleStageActions
            site={site}
            onTransitionComplete={handleLifecycleTransition}
            isAdmin={true}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-4 border-t border-gray-50">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5"/>
            <span>Updated {formatDate(site.updated_at)}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            isCustomerControlled 
              ? 'bg-blue-500' 
              : hasProspect 
                ? 'bg-green-500' 
                : 'bg-gray-300'
          }`} />
        </div>
      </CardFooter>
    </Card>
  );
};

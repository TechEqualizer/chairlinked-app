
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, BarChart3, MessageSquare, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Site {
  id: string;
  business_name: string;
  site_slug: string;
}

interface QuickActionsPanelProps {
  site: Site;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ site }) => {
  const { toast } = useToast();

  const actions = [
    {
      icon: Share2,
      label: 'Share Site',
      description: 'Get sharing links and embed codes',
      action: () => {
        navigator.clipboard.writeText(`https://chairlinked.com/${site.site_slug}`);
        toast({
          title: "URL Copied!",
          description: "Your ChairLinked URL has been copied to clipboard.",
        });
      },
      variant: 'default' as const
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      description: 'See detailed performance metrics',
      action: () => {
        // For now, scroll to metrics section or show coming soon
        toast({
          title: "Analytics",
          description: "Detailed analytics coming soon! Basic metrics are shown above.",
        });
      },
      variant: 'outline' as const
    },
    {
      icon: MessageSquare,
      label: 'Request Changes',
      description: 'Request updates to your website',
      action: () => {
        window.location.href = `mailto:support@chairlinked.com?subject=Website Change Request for ${site.business_name}&body=Hi, I'd like to request changes to my ChairLinked website (${site.site_slug}). Here's what I'd like to update:%0D%0A%0D%0A[Please describe your requested changes]`;
      },
      variant: 'outline' as const
    },
    {
      icon: Mail,
      label: 'Contact Support',
      description: 'Get help with your website',
      action: () => {
        window.location.href = `mailto:support@chairlinked.com?subject=Support Request for ${site.business_name}&body=Hi, I need help with my ChairLinked website (${site.site_slug}). Here's my question:%0D%0A%0D%0A[Please describe your question or issue]`;
      },
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex-col items-start text-left"
                onClick={action.action}
              >
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{action.label}</span>
                </div>
                <p className="text-xs text-gray-600">{action.description}</p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

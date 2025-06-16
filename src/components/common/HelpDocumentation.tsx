
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Book, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HelpItem {
  title: string;
  content: string;
  steps?: string[];
}

const helpItems: HelpItem[] = [
  {
    title: "How to Edit Your Site",
    content: "Use the editing tools to customize your website sections.",
    steps: [
      "Click 'Edit' on any section to open the editing panel",
      "Use the text editor to change headlines and descriptions", 
      "Upload new images by clicking the image areas",
      "Save your changes using the save button at the bottom"
    ]
  },
  {
    title: "Managing Sections",
    content: "Control which sections appear on your site and their order.",
    steps: [
      "Go to 'Section Manager' in the editing flow",
      "Toggle sections on/off using the eye icon",
      "Drag sections to reorder them",
      "Changes are saved automatically"
    ]
  },
  {
    title: "Publishing Your Site",
    content: "Make your website live and accessible to visitors.",
    steps: [
      "Complete editing all sections",
      "Click 'Save' to ensure all changes are stored",
      "Your site is automatically published at yourname.chairlinked.com",
      "Share your site URL with customers and prospects"
    ]
  },
  {
    title: "Subscription & Billing",
    content: "Manage your plan and payment information.",
    steps: [
      "View current plan details in your dashboard",
      "Upgrade or downgrade plans as needed",
      "Billing is handled securely through Stripe",
      "Cancel anytime from your account settings"
    ]
  }
];

const HelpDocumentation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 shadow-lg"
          size="sm"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-hidden">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Book className="h-5 w-5" />
              Help Center
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-y-auto">
          {helpItems.map((item) => (
            <Collapsible key={item.title}>
              <CollapsibleTrigger
                onClick={() => toggleItem(item.title)}
                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded"
              >
                <span className="text-sm font-medium">{item.title}</span>
                {openItems.includes(item.title) ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 pr-2 pb-2">
                <p className="text-xs text-gray-600 mb-2">{item.content}</p>
                {item.steps && (
                  <ol className="text-xs space-y-1">
                    {item.steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-blue-600 font-medium">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          <div className="pt-3 border-t space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open('mailto:support@chairlinked.com')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpDocumentation;

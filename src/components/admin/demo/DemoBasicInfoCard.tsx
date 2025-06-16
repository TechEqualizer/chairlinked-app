
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define lifecycle stages and their corresponding labels for admin use
const LIFECYCLE_STAGE_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'ready_to_share', label: 'Ready to Share' },
  { value: 'shared', label: 'Shared' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'converting', label: 'Converting (Payment Initiated)' },
  { value: 'customer_controlled', label: 'Customer Controlled' },
  { value: 'live_published', label: 'Live Published' },
];

interface DemoBasicInfoCardProps {
  businessName: string;
  setBusinessName: (value: string) => void;
  siteSlug: string;
  status: string;
  setStatus: (value: string) => void;
}

export const DemoBasicInfoCard: React.FC<DemoBasicInfoCardProps> = ({
  businessName,
  setBusinessName,
  siteSlug,
  status,
  setStatus
}) => {
  // Generate the demo URL format
  const demoUrl = `charlink.com/demo-${siteSlug}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
          />
        </div>
        
        <div>
          <Label htmlFor="site-slug">Demo Site URL</Label>
          <Input
            id="site-slug"
            value={demoUrl}
            readOnly
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is the temporary demo URL. After approval and payment, it will become: chairlinked.com/{siteSlug}
          </p>
        </div>

        <div>
          <Label htmlFor="status">Status (Lifecycle Stage)</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {LIFECYCLE_STAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Use this menu to update the current lifecycle stage of the demo site.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

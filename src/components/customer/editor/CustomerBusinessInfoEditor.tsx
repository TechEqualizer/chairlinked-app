
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CustomerBusinessInfoEditorProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export const CustomerBusinessInfoEditor: React.FC<CustomerBusinessInfoEditorProps> = ({
  data,
  onUpdate
}) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleLocationChange = (field: string, value: string) => {
    const location = data?.location || {};
    onUpdate({
      location: {
        ...location,
        [field]: value
      }
    });
  };

  const handleContactChange = (field: string, value: string) => {
    const contact = data?.contact || {};
    onUpdate({
      contact: {
        ...contact,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Business Information</h3>
        <p className="text-sm text-gray-600 mb-6">Update your contact details and location</p>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Contact Details</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={data?.contact?.phone || ''}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={data?.contact?.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="hello@yourbusiness.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data?.contact?.website || ''}
              onChange={(e) => handleContactChange('website', e.target.value)}
              placeholder="https://yourbusiness.com"
            />
          </div>
        </div>
      </Card>

      {/* Location Information */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Location</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={data?.location?.address || ''}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data?.location?.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                placeholder="Your City"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={data?.location?.state || ''}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                placeholder="State"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={data?.location?.zipCode || ''}
                onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Business Hours */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Business Hours</h4>
        <div className="space-y-2">
          <Label htmlFor="hours">Operating Hours</Label>
          <Textarea
            id="hours"
            value={data?.businessHours || ''}
            onChange={(e) => handleInputChange('businessHours', e.target.value)}
            placeholder="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
            rows={4}
          />
          <p className="text-xs text-gray-500">Enter your business hours (one day per line)</p>
        </div>
      </Card>
    </div>
  );
};

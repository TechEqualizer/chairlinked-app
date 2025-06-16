
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DemoProspectInfoCardProps {
  prospectName: string;
  setProspectName: (value: string) => void;
  prospectEmail: string;
  setProspectEmail: (value: string) => void;
  demoExpiresAt: string | null;
}

export const DemoProspectInfoCard: React.FC<DemoProspectInfoCardProps> = ({
  prospectName,
  setProspectName,
  prospectEmail,
  setProspectEmail,
  demoExpiresAt
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prospect Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prospect-name">Prospect Name</Label>
          <Input
            id="prospect-name"
            value={prospectName}
            onChange={(e) => setProspectName(e.target.value)}
            placeholder="Enter prospect name (optional)"
          />
        </div>
        
        <div>
          <Label htmlFor="prospect-email">Prospect Email</Label>
          <Input
            id="prospect-email"
            type="email"
            value={prospectEmail}
            onChange={(e) => setProspectEmail(e.target.value)}
            placeholder="Enter prospect email (optional)"
          />
        </div>

        <div>
          <Label htmlFor="demo-expires">Demo Expires</Label>
          <Input
            id="demo-expires"
            value={demoExpiresAt ? new Date(demoExpiresAt).toLocaleDateString() : 'No expiration'}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

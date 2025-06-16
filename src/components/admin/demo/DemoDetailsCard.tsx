
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DemoDetailsCardProps {
  createdAt: string;
  updatedAt: string;
  siteType: string;
}

export const DemoDetailsCard: React.FC<DemoDetailsCardProps> = ({
  createdAt,
  updatedAt,
  siteType
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Created:</span>
            <p className="text-gray-600">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <p className="text-gray-600">{new Date(updatedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Site Type:</span>
            <p className="text-gray-600 capitalize">{siteType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

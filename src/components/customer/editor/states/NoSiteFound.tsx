
import React from 'react';
import { Card } from '@/components/ui/card';

export const NoSiteFound: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex-1 overflow-auto">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No Site Found</h3>
            <p className="text-gray-600">You don't have a claimed site to edit yet.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';

interface ServicesSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: string) => void;
}

export const ServicesSectionEditor: React.FC<ServicesSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            💼 Services & Offerings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Services management coming soon...</p>
            <p className="text-sm mt-2">For now, describe your services in the About section</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

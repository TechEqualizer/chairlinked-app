
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';

interface ContactSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: string) => void;
}

export const ContactSectionEditor: React.FC<ContactSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📞 Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => onUpdateField('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onUpdateField('email', e.target.value)}
              placeholder="hello@yourbusiness.com"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

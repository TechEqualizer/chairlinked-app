
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';

interface AboutSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: string) => void;
}

export const AboutSectionEditor: React.FC<AboutSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📝 About Your Business
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => onUpdateField('description', e.target.value)}
              placeholder="Tell visitors about your business, what makes you unique, and why they should choose you..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

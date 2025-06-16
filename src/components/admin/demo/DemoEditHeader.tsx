
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, Edit } from 'lucide-react';

interface DemoEditHeaderProps {
  onBack: () => void;
  onPreview: () => void;
  onContinueEditing: () => void;
  onSave: () => void;
  saving: boolean;
}

export const DemoEditHeader: React.FC<DemoEditHeaderProps> = ({
  onBack,
  onPreview,
  onContinueEditing,
  onSave,
  saving
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Demo Site</h1>
          <p className="text-gray-600">Modify demo site details and settings</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onPreview} variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={onContinueEditing} variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
          <Edit className="w-4 h-4 mr-2" />
          Continue Editing
        </Button>
        <Button onClick={onSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

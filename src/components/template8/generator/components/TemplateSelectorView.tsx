
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';
import { AdminTemplate } from '@/services/templateService';
import { Button } from '@/components/ui/button';

interface TemplateSelectorViewProps {
  onSelectTemplate: (template: AdminTemplate) => void;
  onSkipTemplate: () => void;
  isLoading: boolean;
}

export const TemplateSelectorView: React.FC<TemplateSelectorViewProps> = ({
  onSelectTemplate,
  onSkipTemplate,
  isLoading
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 bg-white/80 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white/50"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Button>
        </div>

        <TemplateSelector
          onSelectTemplate={onSelectTemplate}
          onSkipTemplate={onSkipTemplate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

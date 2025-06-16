import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/template8/design-system/components/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/template8/design-system/components/Badge';
import { Spinner } from '@/components/template8/design-system/components/Spinner';
import { Heading, Text } from '@/components/template8/design-system/components/Typography';
import { Grid } from '@/components/template8/design-system/components/Container';
import { colors } from '@/components/template8/design-system';
import { Eye, Plus } from 'lucide-react';
import { templateService, AdminTemplate } from '@/services/templateService';
import { useToast } from '@/hooks/use-toast';

interface TemplateSelectorProps {
  onSelectTemplate: (template: AdminTemplate) => void;
  onSkipTemplate: () => void;
  isLoading?: boolean;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  onSkipTemplate,
  isLoading = false
}) => {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await templateService.getAllTemplates();
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      // Increment usage count
      await templateService.incrementUsageCount(selectedTemplate.id);
      onSelectTemplate(selectedTemplate);
    } catch (error) {
      console.error('Error using template:', error);
      toast({
        title: "Error",
        description: "Failed to use template",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" label="Loading templates..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading as="h2" size="md" className="mb-2">Choose a Starting Point</Heading>
        <Text size="lg" color={colors?.neutral?.[600] || '#6b7280'}>Select a template to start with, or start from scratch</Text>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8">
          <Text color={colors?.neutral?.[500] || '#9ca3af'} className="mb-4">No templates available yet</Text>
          <Button 
            onClick={onSkipTemplate} 
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-lg"
          >
            Start from Scratch
          </Button>
        </div>
      ) : (
        <>
          <Grid cols={1} colsMd={2} colsLg={3} gap="md" className="max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                variant="default"
                elevation={selectedTemplate?.id === template.id ? "lg" : "sm"}
                isHoverable
                isInteractive
                className={`overflow-hidden ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {template.preview_image_url ? (
                    <img 
                      src={template.preview_image_url} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <Text size="sm" color={colors?.secondary?.[600] || '#9333ea'} weight="medium">No Preview</Text>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Heading as="h3" size="sm" className="truncate">{template.name}</Heading>
                      <Badge variant="subtle" color="secondary" size="sm" className="mt-1 capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    {template.description && (
                      <Text size="sm" color={colors?.neutral?.[600] || '#6b7280'} clamp={2}>{template.description}</Text>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Text size="xs" color={colors?.neutral?.[500] || '#9ca3af'}>Used {template.usage_count} times</Text>
                      <Text size="xs" color={colors?.neutral?.[500] || '#9ca3af'}>{new Date(template.created_at).toLocaleDateString()}</Text>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={onSkipTemplate}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-lg"
            >
              Start from Scratch
            </Button>
            <Button 
              onClick={handleUseTemplate} 
              disabled={!selectedTemplate || isLoading}
              className="bg-slate-900 hover:bg-black text-white border-0 shadow-lg"
            >
              {isLoading ? 'Loading...' : `Use ${selectedTemplate?.name || 'Template'}`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

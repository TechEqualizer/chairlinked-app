
import React, { useState, useEffect } from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Plus, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminTemplate, templateService } from '@/services/templateService';

const AdminTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await templateService.deleteTemplate(templateId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });

      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handlePreviewTemplate = (template: AdminTemplate) => {
    console.log('handlePreviewTemplate: Starting preview for template:', {
      id: template.id,
      name: template.name,
      hasConfig: !!template.template_config
    });

    try {
      // Clear any existing session data first
      sessionStorage.removeItem('templatePreview');
      sessionStorage.removeItem('editingDemoSite');
      
      // Store template data in the correct format for the generator
      const templatePreviewData = {
        isTemplatePreview: true,
        templateId: template.id,
        templateName: template.name,
        templateConfig: template.template_config,
        businessName: `${template.name} Preview`,
        mode: 'preview',
        recoveryMetadata: {
          loadSource: 'template',
          recoveryVersion: '3.0',
          savedAt: new Date().toISOString()
        }
      };
      
      sessionStorage.setItem('templatePreview', JSON.stringify(templatePreviewData));
      
      console.log('handlePreviewTemplate: Stored template data:', templatePreviewData);
      
      // Open template generator in preview mode
      const previewUrl = `/template8-generator?template=${template.id}&preview=true`;
      window.open(previewUrl, '_blank');
      
    } catch (error) {
      console.error('handlePreviewTemplate: Error setting up preview:', error);
      toast({
        title: "Error",
        description: "Failed to preview template",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
              <p className="text-slate-600 text-lg">Manage your reusable demo site templates</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl beautiful-shadow">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {templates.length === 0 ? (
          <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No templates yet</h3>
              <p className="text-slate-500 mb-4">
                Create templates from your demo sites to reuse designs and configurations.
              </p>
              <p className="text-sm text-slate-400">
                Go to Demo Sites and use the "Save as Template" button to create your first template.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="beautiful-shadow border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                  {template.preview_image_url ? (
                    <img 
                      src={template.preview_image_url} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-purple-600 font-medium">No Preview</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 truncate">{template.name}</h3>
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full capitalize">
                        {template.category}
                      </span>
                    </div>
                    {template.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Used {template.usage_count} times</span>
                      <span>{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 rounded-xl"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
};

export default AdminTemplates;

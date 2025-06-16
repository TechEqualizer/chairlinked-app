
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { templateService } from '@/services/templateService';
import { useToast } from '@/hooks/use-toast';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoSite: {
    id: string;
    business_name: string;
    generated_config: any;
  };
  onSuccess?: () => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  demoSite,
  onSuccess
}) => {
  const [name, setName] = useState(`${demoSite.business_name} Template`);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean the template config
      const cleanedConfig = templateService.cleanTemplateConfig(
        demoSite.generated_config,
        demoSite.business_name
      );

      const { data, error } = await templateService.createTemplateFromDemo({
        name,
        description,
        category,
        template_config: cleanedConfig,
        source_demo_id: demoSite.id
      });

      if (error) throw error;

      toast({
        title: "Template created successfully!",
        description: `"${name}" has been added to your template library.`,
        duration: 4000,
      });

      onSuccess?.();
      onClose();
      
      // Reset form
      setName(`${demoSite.business_name} Template`);
      setDescription('');
      setCategory('custom');
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Template from Demo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description (Optional)</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this template..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-blue-900 mb-2">Template Preview</h4>
            <p className="text-sm text-blue-700">
              Based on: <span className="font-medium">{demoSite.business_name}</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Business-specific content will be replaced with placeholders
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Creating...' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;

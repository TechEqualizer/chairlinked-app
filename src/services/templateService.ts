
import { supabase } from '@/integrations/supabase/client';

export interface AdminTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  preview_image_url: string | null;
  template_config: any;
  source_demo_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
  is_active: boolean;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: string;
  template_config: any;
  source_demo_id: string;
  preview_image_url?: string;
}

class TemplateService {
  async createTemplateFromDemo(request: CreateTemplateRequest): Promise<{ data: AdminTemplate | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_templates')
        .insert({
          name: request.name,
          description: request.description,
          category: request.category,
          template_config: request.template_config,
          source_demo_id: request.source_demo_id,
          preview_image_url: request.preview_image_url,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      return { data: data as AdminTemplate, error };
    } catch (error) {
      console.error('Error creating template:', error);
      return { data: null, error };
    }
  }

  async getAllTemplates(): Promise<{ data: AdminTemplate[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      return { data: data as AdminTemplate[], error };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return { data: null, error };
    }
  }

  async deleteTemplate(templateId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('admin_templates')
        .update({ is_active: false })
        .eq('id', templateId);

      return { error };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { error };
    }
  }

  async incrementUsageCount(templateId: string): Promise<{ error: any }> {
    try {
      // Get current usage count and increment it
      const { data: template, error: fetchError } = await supabase
        .from('admin_templates')
        .select('usage_count')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('admin_templates')
        .update({ usage_count: (template.usage_count || 0) + 1 })
        .eq('id', templateId);

      return { error };
    } catch (error) {
      console.error('Error incrementing usage count:', error);
      return { error };
    }
  }

  // Clean template config by removing demo-specific data
  cleanTemplateConfig(demoConfig: any, businessName: string): any {
    if (!demoConfig) return {};

    const cleanConfig = { ...demoConfig };

    // Remove or replace demo-specific data
    if (cleanConfig.businessName) {
      cleanConfig.businessName = "Your Business Name";
    }
    
    if (cleanConfig.headline) {
      cleanConfig.headline = cleanConfig.headline.replace(businessName, "Your Business Name");
    }
    
    if (cleanConfig.description) {
      cleanConfig.description = "Your business description goes here";
    }

    if (cleanConfig.contactEmail) {
      cleanConfig.contactEmail = "hello@yourbusiness.com";
    }

    if (cleanConfig.phoneNumber) {
      cleanConfig.phoneNumber = "(555) 123-4567";
    }

    if (cleanConfig.instagramHandle) {
      cleanConfig.instagramHandle = "@yourbusiness";
    }

    // Keep styling, layout, and design elements
    // Keep: brandColor, backgroundColor, fontFamily, heroImages, services structure, testimonials structure, etc.

    return cleanConfig;
  }
}

export const templateService = new TemplateService();

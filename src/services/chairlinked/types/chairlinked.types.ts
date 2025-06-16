import { SiteLifecycleStage } from "@/types/siteLifecycle";

export interface ChairLinkedSite {
  id: string;
  site_slug: string;
  business_name: string;
  generated_config: any;
  form_data: any;
  logo_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  lifecycle_stage: SiteLifecycleStage | null;
  // Demo-specific fields
  site_type?: string;
  demo_expires_at?: string | null;
  demo_view_count?: number;
  demo_last_viewed?: string | null;
  demo_engagement_score?: number | null;
  prospect_name?: string | null;
  prospect_email?: string | null;
}

export interface SaveSiteRequest {
  businessName: string;
  generatedConfig: any;
  formData: any;
  logoUrl?: string;
  status?: 'draft' | 'published';
  initialEngagement?: {
    hearts: number;
    comments: number;
    saves: number;
  };
}

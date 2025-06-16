export type SiteLifecycleStage = 
  | 'draft'
  | 'ready_to_share'
  | 'shared'
  | 'claimed'
  | 'converting'
  | 'customer_controlled'
  | 'live_published';

export interface SiteWithLifecycle {
  id: string;
  business_name: string;
  site_slug: string;
  prospect_name: string | null;
  prospect_email: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  site_type?: string;
  user_id?: string;
  demo_view_count?: number;
  demo_last_viewed?: string;
  generated_config?: any;
  lifecycle_stage: SiteLifecycleStage;
  shared_at?: string | null;
  payment_initiated_at?: string | null;
  payment_completed_at?: string | null;
  customer_control_granted_at?: string | null;
  follow_up_status?: string;
}

export interface LifecycleTransitionResult {
  success: boolean;
  from_stage?: SiteLifecycleStage;
  to_stage?: SiteLifecycleStage;
  site_id?: string;
  error?: string;
}

export interface LifecycleStageStats {
  stage: SiteLifecycleStage;
  count: number;
  percentage: number;
}

export const LIFECYCLE_STAGE_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
    icon: '📝',
    description: 'Site is being created or edited'
  },
  ready_to_share: {
    label: 'Ready to Share',
    color: 'bg-blue-100 text-blue-800',
    icon: '🚀',
    description: 'Site is ready for demo sharing'
  },
  shared: {
    label: 'Shared',
    color: 'bg-purple-100 text-purple-800',
    icon: '🔗',
    description: 'Demo link has been shared with prospect'
  },
  claimed: {
    label: 'Claimed',
    color: 'bg-green-100 text-green-800',
    icon: '✋',
    description: 'Prospect has claimed the demo site'
  },
  converting: {
    label: 'Converting',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '💳',
    description: 'Payment process initiated'
  },
  customer_controlled: {
    label: 'Customer Controlled',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '👤',
    description: 'Customer has control and editing access'
  },
  live_published: {
    label: 'Live Published',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '🌐',
    description: 'Site is live and published'
  }
} as const;

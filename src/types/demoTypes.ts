
export interface DemoStatus {
  isExpired: boolean;
  timeRemaining: number;
  timeRemainingFormatted: string;
  isUrgent: boolean;
  expirationDate?: Date;
}

export interface DemoClaimData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ClaimedSite {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
  created_at: string;
  claimed_at: string;
}

export const DEMO_EXPIRATION_OPTIONS = [
  { value: 1, label: '1 Hour' },
  { value: 6, label: '6 Hours' },
  { value: 12, label: '12 Hours' },
  { value: 24, label: '1 Day' },
  { value: 72, label: '3 Days' },
  { value: 168, label: '1 Week' },
  { value: 720, label: '30 Days' }
];

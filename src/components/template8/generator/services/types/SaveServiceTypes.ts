
export interface SaveResult {
  success: boolean;
  error?: string;
  url?: string;
  demoId?: string;
  requiresAuth?: boolean;
}

export interface EnhancedSaveOptions {
  existingDemoId?: string;
  isEditingExisting?: boolean;
  forceCreate?: boolean;
  maxRetries?: number;
}

export interface SaveStrategy {
  action: 'create' | 'update';
  demoId?: string;
  reason: string;
}

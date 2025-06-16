
export interface Template8Data {
  businessName?: string;
  headline?: string;
  subheadline?: string;
  tagline?: string;
  description?: string;
  heroImage?: string;
  heroImages?: string[];
  brandColor?: string;
  fontFamily?: string;
  services?: Array<{
    title: string;
    description: string;
    price?: string;
  }>;
  testimonials?: Array<{
    id: number;
    name: string;
    role?: string;
    avatar?: string;
    content: string;
    rating: number;
    featured?: boolean;
  }>;
  images?: Array<{
    id: number;
    image: string;
    likes: number;
    comments: number;
    caption: string;
    user: string;
    category: string;
  }>;
  contactEmail?: string;
  phoneNumber?: string;
  instagramHandle?: string;
  ctaText?: string;
  bookingLink?: string;
  // Demo-related properties
  _demoId?: string;
  _isEditingExisting?: boolean;
  _lastSavedAt?: number;
  _businessName?: string;
  _sessionKey?: string;
  _lastUpdateTimestamp?: number;
  // Database state tracking properties
  _loadedFromDatabase?: boolean;
  _lastDatabaseUpdate?: string;
  _recoveryTimestamp?: number;
  _hasBusinessData?: boolean;
  _hasCustomContent?: boolean;
  _recoveredFromSession?: boolean;
  _sessionRecoverySource?: string;
  _createdFromMinimalData?: boolean;
  // Template and generation tracking properties
  _isNewFromTemplate?: boolean;
  _generationSource?: 'template' | 'scratch' | 'enhanced-ai';
  _sourceTemplateId?: string;
  _sourceTemplateName?: string;
  _isNewDemo?: boolean;
  _createdAt?: string;
}

export type GeneratorMode = 'form' | 'preview' | 'editing' | 'template';

export interface GeneratorState {
  mode: GeneratorMode;
  generatedData: Partial<Template8Data> | null;
  isGenerating: boolean;
  isSavingDemo: boolean;
  error: string | null;
}

export interface AdminFunctionality {
  isAdmin: boolean;
  onSaveAsDemo: () => Promise<void>;
  isSavingDemo: boolean;
}

export interface NavigationActions {
  onBackToForm: () => void;
  onStartEditing: () => void;
  onCloseEditing: () => void;
  onNavigateToAdmin: () => void;
  onResetToForm: () => void;
}

export interface GeneratorActions {
  onGenerate: (formData: any) => Promise<void>;
  onUpdate: (updates: any) => void;
  onSave: () => Promise<void>;
}

// Extended editing state interface for auto-save
export interface ExtendedEditingState {
  currentSectionIndex?: number;
  isEditingMode?: boolean;
  isPreviewMode?: boolean;
  areBarsCollapsed?: boolean;
  mode?: string;
  isGenerating?: boolean;
  error?: string;
  timestamp?: number;
  isDemoEditing?: boolean;
  demoId?: string;
  hasUserContent?: boolean;
  hasBusinessData?: boolean;
  autoSaveVersion?: string;
}

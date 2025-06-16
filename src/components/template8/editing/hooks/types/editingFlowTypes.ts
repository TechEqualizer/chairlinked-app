
export interface UseEditingFlowProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => void;
  totalSections: number;
}

export interface HistoryEntry {
  timestamp: string;
  sectionIndex: number;
  data: any;
  action: string;
}

export interface RegenerationState {
  isRegenerating: boolean;
  lastRegenerationResult: any;
  regenerationHistory: HistoryEntry[];
}

export interface NavigationState {
  currentSectionIndex: number;
  swipeDirection: 'left' | 'right' | null;
  isCompleted: boolean;
}

export interface EditingState {
  isEditBarOpen: boolean;
  isSaving: boolean;
}

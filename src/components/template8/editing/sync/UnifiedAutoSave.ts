import { Template8Data, EditorChangeEvent } from '../state/EditorStateManager';
import { getSyncBridge, emitSave } from './SyncBridge';

// Auto-save state management
export type AutoSaveState = 
  | 'idle'           // No unsaved changes
  | 'pending'        // Changes pending, waiting for debounce
  | 'saving'         // Currently saving
  | 'saved'          // Recently saved successfully  
  | 'error'          // Save failed
  | 'paused'         // Auto-save manually paused
  | 'conflict';      // Conflict detected, manual resolution needed

// Auto-save configuration
export interface AutoSaveConfig {
  // Timing
  debounceMs: number;
  maxWaitMs: number;        // Force save after this time regardless
  retryDelayMs: number;
  
  // Retry logic
  maxRetries: number;
  exponentialBackoff: boolean;
  
  // Context awareness
  pauseOnUserTyping: boolean;
  pauseOnModeSwitch: boolean;
  
  // Change filtering
  ignoreChangeTypes: EditorChangeEvent['type'][];
  criticalProperties: string[];  // Always save these immediately
  
  // Conflict handling
  conflictResolution: 'local' | 'external' | 'manual';
  
  // Callbacks
  onSave: (data: Partial<Template8Data>) => Promise<void>;
  onError?: (error: Error) => void;
  onStateChange?: (state: AutoSaveState) => void;
}

// Default configuration
const DEFAULT_CONFIG: Omit<AutoSaveConfig, 'onSave'> = {
  debounceMs: 1000,
  maxWaitMs: 30000,
  retryDelayMs: 2000,
  maxRetries: 3,
  exponentialBackoff: true,
  pauseOnUserTyping: true,
  pauseOnModeSwitch: false,
  ignoreChangeTypes: [],
  criticalProperties: ['businessName', 'heroTitle', 'brandColor'],
  conflictResolution: 'local'
};

// Save attempt tracking
interface SaveAttempt {
  id: string;
  timestamp: number;
  data: Partial<Template8Data>;
  attempt: number;
  error?: Error;
}

export class UnifiedAutoSave {
  private config: AutoSaveConfig;
  private state: AutoSaveState;
  private pendingChanges: EditorChangeEvent[];
  private lastSaveData: Partial<Template8Data>;
  private debounceTimeout: NodeJS.Timeout | null;
  private maxWaitTimeout: NodeJS.Timeout | null;
  private retryTimeout: NodeJS.Timeout | null;
  private currentSaveAttempt: SaveAttempt | null;
  private saveHistory: SaveAttempt[];
  private userInteractionTracker: UserInteractionTracker;
  private syncBridge: any; // SyncBridge instance

  constructor(config: AutoSaveConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = 'idle';
    this.pendingChanges = [];
    this.lastSaveData = {};
    this.debounceTimeout = null;
    this.maxWaitTimeout = null;
    this.retryTimeout = null;
    this.currentSaveAttempt = null;
    this.saveHistory = [];
    this.userInteractionTracker = new UserInteractionTracker();
    this.syncBridge = getSyncBridge();

    this.setupEventListeners();
    this.log('AutoSave initialized', { config: this.config });
  }

  // Public API
  public addChanges(changes: EditorChangeEvent[]): void {
    if (this.state === 'paused') {
      this.log('Changes ignored - auto-save is paused');
      return;
    }

    // Filter out ignored change types
    const relevantChanges = changes.filter(change => 
      !this.config.ignoreChangeTypes.includes(change.type)
    );

    if (relevantChanges.length === 0) {
      return;
    }

    this.pendingChanges.push(...relevantChanges);
    this.log('Changes added', { count: relevantChanges.length, total: this.pendingChanges.length });

    // Check for critical changes that need immediate save
    const hasCriticalChanges = relevantChanges.some(change => 
      this.config.criticalProperties.includes(change.property)
    );

    if (hasCriticalChanges) {
      this.log('Critical changes detected - triggering immediate save');
      this.triggerSave(true);
    } else {
      this.triggerSave(false);
    }
  }

  public updateData(data: Partial<Template8Data>): void {
    this.lastSaveData = { ...this.lastSaveData, ...data };
    this.log('Data updated', { keys: Object.keys(data) });
  }

  public pause(): void {
    this.setState('paused');
    this.clearTimeouts();
    this.log('Auto-save paused');
  }

  public resume(): void {
    if (this.state === 'paused') {
      this.setState('idle');
      if (this.pendingChanges.length > 0) {
        this.triggerSave(false);
      }
      this.log('Auto-save resumed');
    }
  }

  public forceSave(): Promise<void> {
    this.log('Force save triggered');
    return this.performSave(true);
  }

  public getState(): AutoSaveState {
    return this.state;
  }

  public getPendingChangesCount(): number {
    return this.pendingChanges.length;
  }

  public getLastSaveData(): Partial<Template8Data> {
    return { ...this.lastSaveData };
  }

  public getSaveHistory(): SaveAttempt[] {
    return [...this.saveHistory];
  }

  // Private methods
  private setupEventListeners(): void {
    // Listen for conflicts
    this.syncBridge.on('conflict', (event: any) => {
      this.handleConflict(event.data);
    });

    // Listen for mode switches
    this.syncBridge.on('mode-switch', (event: any) => {
      if (this.config.pauseOnModeSwitch) {
        this.pause();
        setTimeout(() => this.resume(), 1000); // Resume after mode switch
      }
    });

    // Track user interactions
    if (this.config.pauseOnUserTyping) {
      this.userInteractionTracker.onTyping(() => {
        this.pauseTemporarily(2000); // Pause for 2 seconds during typing
      });
    }
  }

  private triggerSave(immediate: boolean): void {
    if (this.state === 'saving' || this.state === 'paused') {
      return;
    }

    // Clear existing timeouts
    this.clearTimeouts();

    if (immediate) {
      this.performSave(false);
    } else {
      // Set up debounced save
      this.setState('pending');
      
      this.debounceTimeout = setTimeout(() => {
        this.performSave(false);
      }, this.config.debounceMs);

      // Set up max wait timeout
      this.maxWaitTimeout = setTimeout(() => {
        this.log('Max wait time reached - forcing save');
        this.performSave(true);
      }, this.config.maxWaitMs);
    }
  }

  private async performSave(force: boolean): Promise<void> {
    if (this.state === 'saving' && !force) {
      this.log('Save already in progress');
      return;
    }

    if (this.pendingChanges.length === 0 && !force) {
      this.log('No pending changes to save');
      this.setState('idle');
      return;
    }

    this.clearTimeouts();
    this.setState('saving');

    const saveAttempt: SaveAttempt = {
      id: this.generateSaveId(),
      timestamp: Date.now(),
      data: { ...this.lastSaveData },
      attempt: 1
    };

    this.currentSaveAttempt = saveAttempt;
    this.log('Starting save attempt', { id: saveAttempt.id, force });

    try {
      await this.config.onSave(saveAttempt.data);
      
      // Save successful
      this.handleSaveSuccess(saveAttempt);
      
    } catch (error) {
      this.handleSaveError(saveAttempt, error as Error);
    }
  }

  private handleSaveSuccess(saveAttempt: SaveAttempt): void {
    this.log('Save successful', { id: saveAttempt.id });
    
    this.saveHistory.push(saveAttempt);
    this.currentSaveAttempt = null;
    this.pendingChanges = [];
    this.setState('saved');

    // Emit save event
    emitSave(saveAttempt.data, 'external');

    // Return to idle after a short display period
    setTimeout(() => {
      if (this.state === 'saved') {
        this.setState('idle');
      }
    }, 2000);
  }

  private handleSaveError(saveAttempt: SaveAttempt, error: Error): void {
    saveAttempt.error = error;
    this.log('Save failed', { id: saveAttempt.id, attempt: saveAttempt.attempt, error: error.message });

    if (this.config.onError) {
      this.config.onError(error);
    }

    // Retry logic
    if (saveAttempt.attempt < this.config.maxRetries) {
      this.scheduleRetry(saveAttempt);
    } else {
      // Max retries exceeded
      this.saveHistory.push(saveAttempt);
      this.currentSaveAttempt = null;
      this.setState('error');
      this.log('Max retries exceeded - save failed permanently');
    }
  }

  private scheduleRetry(saveAttempt: SaveAttempt): void {
    const delay = this.config.exponentialBackoff
      ? this.config.retryDelayMs * Math.pow(2, saveAttempt.attempt - 1)
      : this.config.retryDelayMs;

    this.log('Scheduling retry', { id: saveAttempt.id, attempt: saveAttempt.attempt + 1, delay });

    this.retryTimeout = setTimeout(() => {
      saveAttempt.attempt++;
      this.performSave(true);
    }, delay);
  }

  private handleConflict(conflictData: any): void {
    this.log('Conflict detected', conflictData);
    
    switch (this.config.conflictResolution) {
      case 'local':
        // Ignore external changes, continue with local data
        this.log('Conflict resolved: using local data');
        break;
        
      case 'external':
        // Accept external changes, clear pending changes
        this.pendingChanges = [];
        this.setState('idle');
        this.log('Conflict resolved: using external data');
        break;
        
      case 'manual':
        // Pause auto-save and wait for manual resolution
        this.setState('conflict');
        this.log('Conflict requires manual resolution');
        break;
    }
  }

  private pauseTemporarily(ms: number): void {
    if (this.state === 'paused') return;
    
    const originalState = this.state;
    this.pause();
    
    setTimeout(() => {
      if (this.state === 'paused') {
        this.setState(originalState);
        this.resume();
      }
    }, ms);
  }

  private clearTimeouts(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    if (this.maxWaitTimeout) {
      clearTimeout(this.maxWaitTimeout);
      this.maxWaitTimeout = null;
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  private setState(newState: AutoSaveState): void {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      this.log('State changed', { from: oldState, to: newState });
      
      if (this.config.onStateChange) {
        this.config.onStateChange(newState);
      }
    }
  }

  private generateSaveId(): string {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  private log(message: string, data?: any): void {
    const prefix = '[UnifiedAutoSave]';
    if (data) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }

  // Cleanup
  public destroy(): void {
    this.clearTimeouts();
    this.userInteractionTracker.destroy();
    this.log('AutoSave destroyed');
  }
}

// User interaction tracking
class UserInteractionTracker {
  private typingTimeout: NodeJS.Timeout | null;
  private typingCallbacks: (() => void)[];
  private isDestroyed: boolean;

  constructor() {
    this.typingTimeout = null;
    this.typingCallbacks = [];
    this.isDestroyed = false;
    this.setupListeners();
  }

  public onTyping(callback: () => void): () => void {
    this.typingCallbacks.push(callback);
    
    return () => {
      const index = this.typingCallbacks.indexOf(callback);
      if (index > -1) {
        this.typingCallbacks.splice(index, 1);
      }
    };
  }

  private setupListeners(): void {
    // Listen for keyboard events that indicate typing
    const handleTyping = () => {
      if (this.isDestroyed) return;
      
      // Clear existing timeout
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      // Notify callbacks
      this.typingCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('[UserInteractionTracker] Error in typing callback:', error);
        }
      });
      
      // Set timeout to detect when typing stops
      this.typingTimeout = setTimeout(() => {
        // Typing has stopped
      }, 1000);
    };

    document.addEventListener('keydown', handleTyping);
    document.addEventListener('input', handleTyping);

    // Store cleanup function
    this.cleanup = () => {
      document.removeEventListener('keydown', handleTyping);
      document.removeEventListener('input', handleTyping);
    };
  }

  private cleanup: (() => void) | null = null;

  public destroy(): void {
    this.isDestroyed = true;
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    
    this.typingCallbacks = [];
  }
}

// Factory function for easy creation
export const createUnifiedAutoSave = (config: AutoSaveConfig): UnifiedAutoSave => {
  return new UnifiedAutoSave(config);
};
import { EditorChangeEvent, Template8Data } from '../state/EditorStateManager';

// Event system for real-time communication between editors
type SyncEventType = 'change' | 'selection' | 'mode-switch' | 'save' | 'conflict' | 'error';

interface SyncEvent {
  id: string;
  type: SyncEventType;
  timestamp: number;
  source: 'quick-editor' | 'fullscreen-editor' | 'external';
  target?: 'quick-editor' | 'fullscreen-editor' | 'all';
  data: any;
  metadata?: Record<string, any>;
}

// Sync bridge configuration
interface SyncBridgeConfig {
  // Performance settings
  batchSize: number;
  batchDelay: number;
  maxRetries: number;
  
  // Conflict resolution
  enableConflictDetection: boolean;
  conflictTimeout: number;
  
  // Debugging
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

// Default configuration
const DEFAULT_CONFIG: SyncBridgeConfig = {
  batchSize: 10,
  batchDelay: 50,
  maxRetries: 3,
  enableConflictDetection: true,
  conflictTimeout: 2000,
  enableLogging: true,
  logLevel: 'info'
};

// Event listener type
type SyncEventListener = (event: SyncEvent) => void;

// Conflict detection entry
interface ConflictEntry {
  property: string;
  timestamp: number;
  sources: Set<string>;
  values: Map<string, any>;
}

export class SyncBridge {
  private config: SyncBridgeConfig;
  private listeners: Map<SyncEventType, Set<SyncEventListener>>;
  private eventQueue: SyncEvent[];
  private batchTimeout: NodeJS.Timeout | null;
  private isProcessing: boolean;
  private conflictTracker: Map<string, ConflictEntry>;
  private nextEventId: number;

  constructor(config?: Partial<SyncBridgeConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.listeners = new Map();
    this.eventQueue = [];
    this.batchTimeout = null;
    this.isProcessing = false;
    this.conflictTracker = new Map();
    this.nextEventId = 0;

    // Initialize event types
    (['change', 'selection', 'mode-switch', 'save', 'conflict', 'error'] as SyncEventType[]).forEach(type => {
      this.listeners.set(type, new Set());
    });

    this.log('info', 'SyncBridge initialized', { config: this.config });
  }

  // Event emission
  public emit(type: SyncEventType, data: any, source: SyncEvent['source'], target?: SyncEvent['target'], metadata?: Record<string, any>): void {
    const event: SyncEvent = {
      id: this.generateEventId(),
      type,
      timestamp: Date.now(),
      source,
      target,
      data,
      metadata
    };

    this.log('debug', 'Event emitted', event);

    // Conflict detection for change events
    if (type === 'change' && this.config.enableConflictDetection) {
      this.detectConflicts(event);
    }

    // Add to queue for batched processing
    this.eventQueue.push(event);

    // Process queue
    this.scheduleProcessing();
  }

  // Event subscription
  public on(type: SyncEventType, listener: SyncEventListener): () => void {
    const listeners = this.listeners.get(type);
    if (!listeners) {
      throw new Error(`Unknown event type: ${type}`);
    }

    listeners.add(listener);
    this.log('debug', 'Event listener added', { type, listenerCount: listeners.size });

    // Return unsubscribe function
    return () => {
      listeners.delete(listener);
      this.log('debug', 'Event listener removed', { type, listenerCount: listeners.size });
    };
  }

  // Batch processing
  private scheduleProcessing(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processEventQueue();
    }, this.config.batchDelay);
  }

  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.batchTimeout = null;

    try {
      // Process events in batches
      while (this.eventQueue.length > 0) {
        const batch = this.eventQueue.splice(0, this.config.batchSize);
        await this.processBatch(batch);
      }
    } catch (error) {
      this.log('error', 'Error processing event queue', { error });
    } finally {
      this.isProcessing = false;
    }
  }

  private async processBatch(events: SyncEvent[]): Promise<void> {
    this.log('debug', 'Processing event batch', { count: events.length });

    // Group events by type for efficient processing
    const eventsByType = new Map<SyncEventType, SyncEvent[]>();
    events.forEach(event => {
      if (!eventsByType.has(event.type)) {
        eventsByType.set(event.type, []);
      }
      eventsByType.get(event.type)!.push(event);
    });

    // Process each type sequentially
    for (const [type, typeEvents] of eventsByType) {
      await this.processEventType(type, typeEvents);
    }
  }

  private async processEventType(type: SyncEventType, events: SyncEvent[]): Promise<void> {
    const listeners = this.listeners.get(type);
    if (!listeners || listeners.size === 0) {
      return;
    }

    // Notify all listeners
    for (const listener of listeners) {
      try {
        for (const event of events) {
          // Check target filtering
          if (event.target && !this.shouldDeliverEvent(event)) {
            continue;
          }

          await Promise.resolve(listener(event));
        }
      } catch (error) {
        this.log('error', 'Error in event listener', { type, error });
        
        // Emit error event
        this.emit('error', { 
          originalEvent: events[0], 
          error: error instanceof Error ? error.message : String(error) 
        }, 'external');
      }
    }
  }

  private shouldDeliverEvent(event: SyncEvent): boolean {
    // For now, simple target-based filtering
    // Could be enhanced with more sophisticated routing
    return !event.target || event.target === 'all';
  }

  // Conflict detection
  private detectConflicts(event: SyncEvent): void {
    if (event.type !== 'change' || !event.data.changes) {
      return;
    }

    const changes = event.data.changes as EditorChangeEvent[];
    const now = Date.now();

    changes.forEach(change => {
      const key = change.property;
      let conflict = this.conflictTracker.get(key);

      if (!conflict) {
        conflict = {
          property: key,
          timestamp: now,
          sources: new Set(),
          values: new Map()
        };
        this.conflictTracker.set(key, conflict);
      }

      // Check if this is a conflicting change
      const timeDiff = now - conflict.timestamp;
      if (timeDiff < this.config.conflictTimeout) {
        conflict.sources.add(event.source);
        conflict.values.set(event.source, change.newValue);

        // If we have changes from multiple sources, it's a conflict
        if (conflict.sources.size > 1) {
          this.handleConflict(conflict);
        }
      } else {
        // Reset conflict tracking for this property
        conflict.timestamp = now;
        conflict.sources.clear();
        conflict.values.clear();
        conflict.sources.add(event.source);
        conflict.values.set(event.source, change.newValue);
      }
    });
  }

  private handleConflict(conflict: ConflictEntry): void {
    this.log('warn', 'Conflict detected', {
      property: conflict.property,
      sources: Array.from(conflict.sources),
      values: Object.fromEntries(conflict.values)
    });

    // Emit conflict event
    this.emit('conflict', {
      property: conflict.property,
      sources: Array.from(conflict.sources),
      values: Object.fromEntries(conflict.values),
      timestamp: conflict.timestamp
    }, 'external');

    // Clean up this conflict
    this.conflictTracker.delete(conflict.property);
  }

  // Utility methods
  private generateEventId(): string {
    return `sync_${Date.now()}_${++this.nextEventId}`;
  }

  private log(level: SyncBridgeConfig['logLevel'], message: string, data?: any): void {
    if (!this.config.enableLogging) return;

    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevel = levels.indexOf(this.config.logLevel);
    const messageLevel = levels.indexOf(level);

    if (messageLevel <= currentLevel) {
      const prefix = `[SyncBridge:${level.toUpperCase()}]`;
      
      if (data) {
        console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](prefix, message, data);
      } else {
        console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](prefix, message);
      }
    }
  }

  // Public utility methods
  public getQueueSize(): number {
    return this.eventQueue.length;
  }

  public getListenerCount(type?: SyncEventType): number {
    if (type) {
      return this.listeners.get(type)?.size || 0;
    }
    
    let total = 0;
    for (const listeners of this.listeners.values()) {
      total += listeners.size;
    }
    return total;
  }

  public getConflictCount(): number {
    return this.conflictTracker.size;
  }

  public clearConflicts(): void {
    this.conflictTracker.clear();
    this.log('info', 'Conflicts cleared');
  }

  public getConfig(): SyncBridgeConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<SyncBridgeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('info', 'Configuration updated', newConfig);
  }

  // Cleanup
  public destroy(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    this.eventQueue.length = 0;
    this.listeners.clear();
    this.conflictTracker.clear();
    this.isProcessing = false;

    this.log('info', 'SyncBridge destroyed');
  }
}

// Global singleton instance for easy access
let globalSyncBridge: SyncBridge | null = null;

export const getSyncBridge = (config?: Partial<SyncBridgeConfig>): SyncBridge => {
  if (!globalSyncBridge) {
    globalSyncBridge = new SyncBridge(config);
  }
  return globalSyncBridge;
};

export const destroySyncBridge = (): void => {
  if (globalSyncBridge) {
    globalSyncBridge.destroy();
    globalSyncBridge = null;
  }
};

// Convenience functions for common operations
export const emitChange = (changes: EditorChangeEvent[], source: SyncEvent['source'], target?: SyncEvent['target']) => {
  const bridge = getSyncBridge();
  bridge.emit('change', { changes }, source, target);
};

export const emitSelection = (element: any, source: SyncEvent['source'], target?: SyncEvent['target']) => {
  const bridge = getSyncBridge();
  bridge.emit('selection', { element }, source, target);
};

export const emitModeSwitch = (fromMode: string, toMode: string, source: SyncEvent['source']) => {
  const bridge = getSyncBridge();
  bridge.emit('mode-switch', { fromMode, toMode }, source);
};

export const emitSave = (data: Partial<Template8Data>, source: SyncEvent['source']) => {
  const bridge = getSyncBridge();
  bridge.emit('save', { data }, source);
};
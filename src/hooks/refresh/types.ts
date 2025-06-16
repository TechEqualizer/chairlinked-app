
export interface UseSimpleDemoRefreshProps {
  onRefresh: () => Promise<void>;
}

export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  new?: { id?: string; business_name?: string; [key: string]: any };
  old?: { id?: string; [key: string]: any };
}

export interface RefreshState {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export interface RefreshConfig {
  MAX_RECONNECT_ATTEMPTS: number;
  RECONNECT_DELAY_MS: number;
  POLLING_INTERVAL_MS: number;
  HEARTBEAT_INTERVAL_MS: number;
}

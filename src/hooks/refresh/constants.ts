
import type { RefreshConfig } from './types';

export const REFRESH_CONFIG: RefreshConfig = {
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 3000, // Start with 3 seconds
  POLLING_INTERVAL_MS: 30000, // 30 seconds
  HEARTBEAT_INTERVAL_MS: 60000, // 60 seconds
};

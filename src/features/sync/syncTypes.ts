/** Mirrors app/modules/sync/schemas.py. health_days is omitted — no
 * client-side health-data source exists yet to populate it. */

export interface SyncCheckInPush {
  clientId: string;
  localDate: string;
  mood: number;
  energy: number | null;
  note: string | null;
  voiceUri: string | null;
  tagKeys: string[];
  updatedAt: string;
}

export interface SyncPushRequest {
  checkIns: SyncCheckInPush[];
}

export interface SyncItemResult {
  status: 'ok' | 'error';
  localDate: string;
  clientId: string | null;
  source: string | null;
  id: string | null;
  error: string | null;
}

export interface SyncPushResponse {
  checkIns: SyncItemResult[];
  healthDays: SyncItemResult[];
}

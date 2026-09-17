/** Local-first domain type. Field names mirror
 * app/modules/checkins/schemas.py (CheckInResponse) but this is the
 * on-device row — the source of truth per backend §1.1 — not a server
 * response. `syncState` and `deletedAt` are local-only bookkeeping the
 * server never sees directly (soft delete becomes a real DELETE on
 * push; see src/features/sync when that lands). */

export type CheckInSource = 'manual' | 'backlog';
export type SyncState = 'pending' | 'synced';

export interface CheckIn {
  clientId: string;
  localDate: string; // YYYY-MM-DD
  mood: number; // 1-5, required
  energy: number | null; // 1-5, optional
  note: string | null;
  voiceUri: string | null;
  tagKeys: string[]; // max 3, keys from tagCatalog
  source: CheckInSource;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601 — drives LWW on sync (single rule, §8)
  syncState: SyncState;
}

/** What the UI collects before a clientId/timestamps are assigned. */
export interface CheckInDraft {
  localDate: string;
  mood: number;
  energy?: number | null;
  note?: string | null;
  voiceUri?: string | null;
  tagKeys?: string[];
}

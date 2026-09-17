import { apiClient } from '@/api/client';

/** Mirrors app/modules/checkins/schemas.py's CheckInResponse. Used only
 * for pull-sync (recovering server data onto a fresh install/device) —
 * every write still goes through SQLite + sync/push, never this
 * directly (the device is the source of truth, §1.1). */
export interface ServerCheckIn {
  id: string;
  clientId: string;
  localDate: string;
  mood: number;
  energy: number | null;
  note: string | null;
  voiceUri: string | null;
  tagKeys: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export const checkinsApi = {
  listRange: (from: string, to: string) =>
    apiClient.get<ServerCheckIn[]>('/checkins', { params: { from, to } }).then((r) => r.data),
};

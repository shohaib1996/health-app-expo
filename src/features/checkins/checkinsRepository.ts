import * as Crypto from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import { getDb } from '@/db/client';
import { runMigrations } from '@/db/migrate';

import { assertWithinBacklogWindow, resolveSource } from './checkinsRules';
import type { CheckIn, CheckInDraft, CheckInSource } from './checkinsTypes';

export { BACKLOG_WINDOW_DAYS, BacklogWindowError } from './checkinsRules';

type CheckInRow = {
  client_id: string;
  local_date: string;
  mood: number;
  energy: number | null;
  note: string | null;
  voice_uri: string | null;
  tag_keys: string;
  source: string;
  created_at: string;
  updated_at: string;
  sync_state: string;
};

function rowToCheckIn(row: CheckInRow): CheckIn {
  return {
    clientId: row.client_id,
    localDate: row.local_date,
    mood: row.mood,
    energy: row.energy,
    note: row.note,
    voiceUri: row.voice_uri,
    tagKeys: JSON.parse(row.tag_keys) as string[],
    source: row.source as CheckInSource,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    syncState: row.sync_state as CheckIn['syncState'],
  };
}

async function db(): Promise<SQLiteDatabase> {
  const database = await getDb();
  await runMigrations(database);
  return database;
}

export const checkinsRepository = {
  /** Upsert on local_date (one check-in per day, same as the backend's
   * uq_checkin_user_date). Mood-only is a complete, valid check-in
   * (S-11) — energy/note/tags stay optional. */
  async upsert(draft: CheckInDraft, today: string): Promise<CheckIn> {
    assertWithinBacklogWindow(draft.localDate, today);

    const database = await db();
    const now = new Date().toISOString();
    const source: CheckInSource = resolveSource(draft.localDate, today);

    const existing = await database.getFirstAsync<CheckInRow>(
      'SELECT * FROM check_ins WHERE local_date = ? AND deleted_at IS NULL',
      draft.localDate,
    );

    const clientId = existing?.client_id ?? Crypto.randomUUID();
    const createdAt = existing?.created_at ?? now;
    const tagKeysJson = JSON.stringify((draft.tagKeys ?? []).slice(0, 3));

    await database.runAsync(
      `INSERT INTO check_ins
         (client_id, local_date, mood, energy, note, voice_uri, tag_keys, source, created_at, updated_at, sync_state, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NULL)
       ON CONFLICT(client_id) DO UPDATE SET
         mood = excluded.mood,
         energy = excluded.energy,
         note = excluded.note,
         voice_uri = excluded.voice_uri,
         tag_keys = excluded.tag_keys,
         source = excluded.source,
         updated_at = excluded.updated_at,
         sync_state = 'pending',
         deleted_at = NULL`,
      clientId,
      draft.localDate,
      draft.mood,
      draft.energy ?? null,
      draft.note ?? null,
      draft.voiceUri ?? null,
      tagKeysJson,
      source,
      createdAt,
      now,
    );

    const row = await database.getFirstAsync<CheckInRow>('SELECT * FROM check_ins WHERE client_id = ?', clientId);
    if (!row) throw new Error('Check-in upsert did not persist.');
    return rowToCheckIn(row);
  },

  async getByDate(localDate: string): Promise<CheckIn | null> {
    const database = await db();
    const row = await database.getFirstAsync<CheckInRow>(
      'SELECT * FROM check_ins WHERE local_date = ? AND deleted_at IS NULL',
      localDate,
    );
    return row ? rowToCheckIn(row) : null;
  },

  async listRange(startDate: string, endDate: string): Promise<CheckIn[]> {
    const database = await db();
    const rows = await database.getAllAsync<CheckInRow>(
      'SELECT * FROM check_ins WHERE local_date >= ? AND local_date <= ? AND deleted_at IS NULL ORDER BY local_date DESC',
      startDate,
      endDate,
    );
    return rows.map(rowToCheckIn);
  },

  async delete(clientId: string): Promise<void> {
    const database = await db();
    await database.runAsync(
      "UPDATE check_ins SET deleted_at = ?, sync_state = 'pending' WHERE client_id = ?",
      new Date().toISOString(),
      clientId,
    );
  },

  async countLoggedNights(): Promise<number> {
    const database = await db();
    const row = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM check_ins WHERE deleted_at IS NULL',
    );
    return row?.count ?? 0;
  },

  async listPendingSync(): Promise<CheckIn[]> {
    const database = await db();
    const rows = await database.getAllAsync<CheckInRow>("SELECT * FROM check_ins WHERE sync_state = 'pending'");
    return rows.map(rowToCheckIn);
  },
};

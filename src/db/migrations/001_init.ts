import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * check_ins mirrors app/modules/checkins/models.py + schemas.py:
 * client_id is the local primary key (idempotency key on sync, §1.1),
 * tag_keys is stored as a JSON array of TagKey strings (max 3, enforced
 * in application code — see checkinsRepository), updated_at drives LWW
 * conflict resolution on both the direct-write and sync paths (single
 * rule per the backend's §8 deferred-fix note).
 *
 * sync_state tracks per-row push status without polluting the domain
 * table: 'pending' (never pushed) | 'synced' (server has this version).
 * A row moves back to 'pending' whenever it's written locally.
 */
export async function up(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS check_ins (
      client_id     TEXT PRIMARY KEY NOT NULL,
      local_date    TEXT NOT NULL,
      mood          INTEGER NOT NULL,
      energy        INTEGER,
      note          TEXT,
      voice_uri     TEXT,
      tag_keys      TEXT NOT NULL DEFAULT '[]',
      source        TEXT NOT NULL DEFAULT 'manual',
      created_at    TEXT NOT NULL,
      updated_at    TEXT NOT NULL,
      sync_state    TEXT NOT NULL DEFAULT 'pending',
      deleted_at    TEXT
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_check_ins_local_date
      ON check_ins (local_date)
      WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS idx_check_ins_sync_state
      ON check_ins (sync_state);
  `);
}

import type { SQLiteDatabase } from 'expo-sqlite';

import { up as up001 } from './migrations/001_init';

/** Ordered list — append, never reorder or edit a past entry once shipped. */
const MIGRATIONS: Array<(db: SQLiteDatabase) => Promise<void>> = [up001];

let migrated = false;

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  if (migrated) return;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);
  `);
  const row = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version LIMIT 1');
  const currentVersion = row?.version ?? 0;

  for (let i = currentVersion; i < MIGRATIONS.length; i++) {
    await MIGRATIONS[i](db);
  }

  if (MIGRATIONS.length > currentVersion) {
    if (row) {
      await db.runAsync('UPDATE schema_version SET version = ?', MIGRATIONS.length);
    } else {
      await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', MIGRATIONS.length);
    }
  }

  migrated = true;
}

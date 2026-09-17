import { type SQLiteDatabase, openDatabaseAsync } from 'expo-sqlite';

/**
 * The device is the source of truth (backend §1.1) — this database,
 * not the server, holds the user's real data. The server is a sync
 * target and AI proxy. Every feature reads/writes here first; sync
 * pushes/pulls happen opportunistically and never block a write.
 */
const DATABASE_NAME = 'hunch.db';

let dbPromise: Promise<SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLiteDatabase> {
  dbPromise ??= openDatabaseAsync(DATABASE_NAME);
  return dbPromise;
}

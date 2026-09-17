/** Pure business rule, isolated from SQLite so it's unit-testable
 * without a native module — mirrors app/modules/checkins/service.py's
 * `_assert_within_backlog_window` (BACKLOG_WINDOW_DAYS = 3, §4.5). */

export const BACKLOG_WINDOW_DAYS = 3;

export class BacklogWindowError extends Error {}

export function assertWithinBacklogWindow(targetDate: string, today: string): void {
  if (targetDate > today) {
    throw new BacklogWindowError('Cannot log a future day.');
  }
  const cutoff = new Date(`${today}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - BACKLOG_WINDOW_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  if (targetDate < cutoffStr) {
    throw new BacklogWindowError(`You can only fill in the last ${BACKLOG_WINDOW_DAYS} days.`);
  }
}

/** manual = logged same-day; backlog = filled in after the fact (S-32). */
export function resolveSource(targetDate: string, today: string): 'manual' | 'backlog' {
  return targetDate === today ? 'manual' : 'backlog';
}

/**
 * The last-write-wins decision behind pull-sync's merge (backend §8's
 * single-LWW-rule note, applied client-side): true means the
 * server's row should overwrite what's local. `localUpdatedAt` is
 * null when nothing exists locally yet for that day — always adopt
 * in that case. Otherwise the server only wins on a strictly later
 * timestamp; a tie keeps the local row, since it's already the one
 * about to push its own version back up.
 */
export function shouldAdoptServerRow(localUpdatedAt: string | null, serverUpdatedAt: string): boolean {
  if (localUpdatedAt === null) return true;
  return serverUpdatedAt > localUpdatedAt;
}

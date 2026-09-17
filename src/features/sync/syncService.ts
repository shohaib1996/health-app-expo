import { checkinsApi } from '@/features/checkins/checkinsApi';
import { checkinsRepository } from '@/features/checkins/checkinsRepository';
import { addDaysToLocalDate, todayLocalDate } from '@/lib/localDate';

import { syncApi } from './syncApi';
import type { SyncCheckInPush } from './syncTypes';

let pushInFlight: Promise<void> | null = null;
let pullInFlight: Promise<void> | null = null;

/** How far back to pull on recovery. Generous enough to cover a
 * finished experiment's before/during window; not unbounded, since
 * this is a full re-fetch, not a real delta (see doPull's note). */
const PULL_WINDOW_DAYS = 120;

/**
 * Best-effort push of every locally pending check-in. Never blocks a
 * caller and never throws — the device is the source of truth (§1.1),
 * so a failed sync just means the same rows stay 'pending' and get
 * retried next time this runs. Single-flight: concurrent callers (a
 * save plus a cold-start sync, say) share one in-progress push rather
 * than racing two.
 *
 * Only check-ins are pushed — SyncPushRequest also carries health_days,
 * but no client-side health-data source exists yet to populate it.
 */
export function pushPendingCheckIns(): Promise<void> {
  pushInFlight ??= doPush().finally(() => {
    pushInFlight = null;
  });
  return pushInFlight;
}

async function doPush(): Promise<void> {
  try {
    const pending = await checkinsRepository.listPendingSync();
    if (pending.length === 0) return;

    const checkIns: SyncCheckInPush[] = pending.map((c) => ({
      clientId: c.clientId,
      localDate: c.localDate,
      mood: c.mood,
      energy: c.energy,
      note: c.note,
      voiceUri: c.voiceUri,
      tagKeys: c.tagKeys,
      updatedAt: c.updatedAt,
    }));

    const result = await syncApi.push({ checkIns });
    const syncedIds = result.checkIns
      .filter((r) => r.status === 'ok' && r.clientId)
      .map((r) => r.clientId as string);
    await checkinsRepository.markSynced(syncedIds);
  } catch {
    // Network down, server unreachable, whatever — the app never
    // blocks on this (§1.1). Rows stay 'pending' and retry next time.
  }
}

/**
 * Recovers server-held check-ins onto this device — the path that
 * makes a reinstall or a second sign-in on a fresh phone not lose
 * history. Not a real delta pull: `GET /sync/pull` only returns a
 * change log (entity ids + timestamps, no content), so turning that
 * into rows would mean a second round-trip per changed entity anyway.
 * A full re-fetch of the last `PULL_WINDOW_DAYS` via `GET /checkins`
 * is simpler, still correct (LWW merge, never overwrites a newer
 * local row — see mergeFromServer), and cheap at this data volume.
 * Single-flight and best-effort, same as the push side.
 */
export function pullServerCheckIns(): Promise<void> {
  pullInFlight ??= doPull().finally(() => {
    pullInFlight = null;
  });
  return pullInFlight;
}

async function doPull(): Promise<void> {
  try {
    const today = todayLocalDate();
    const from = addDaysToLocalDate(today, -PULL_WINDOW_DAYS);
    const serverCheckIns = await checkinsApi.listRange(from, today);

    for (const row of serverCheckIns) {
      await checkinsRepository.mergeFromServer({
        clientId: row.clientId,
        localDate: row.localDate,
        mood: row.mood,
        energy: row.energy,
        note: row.note,
        voiceUri: row.voiceUri,
        tagKeys: row.tagKeys,
        source: row.source,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      });
    }
  } catch {
    // Same rationale as doPush — never blocks the app, just tries
    // again on the next cold start.
  }
}

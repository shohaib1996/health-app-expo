import { checkinsRepository } from '@/features/checkins/checkinsRepository';

import { syncApi } from './syncApi';
import type { SyncCheckInPush } from './syncTypes';

let pushInFlight: Promise<void> | null = null;

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
    const syncedIds = result.checkIns.filter((r) => r.status === 'ok' && r.clientId).map((r) => r.clientId as string);
    await checkinsRepository.markSynced(syncedIds);
  } catch {
    // Network down, server unreachable, whatever — the app never
    // blocks on this (§1.1). Rows stay 'pending' and retry next time.
  }
}

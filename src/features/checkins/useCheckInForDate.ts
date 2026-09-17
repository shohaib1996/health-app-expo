import { useCallback, useEffect, useState } from 'react';

import { pushPendingCheckIns } from '@/features/sync/syncService';
import { todayLocalDate } from '@/lib/localDate';

import { checkinsRepository } from './checkinsRepository';
import type { CheckIn, CheckInDraft } from './checkinsTypes';

interface UseCheckInForDateResult {
  checkIn: CheckIn | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  save: (draft: Omit<CheckInDraft, 'localDate'>) => Promise<CheckIn>;
  refresh: () => Promise<void>;
}

/**
 * Reads/writes the check-in for an arbitrary local date from SQLite
 * (the source of truth, §1.1) — check-ins never go through Redux.
 * Backs both S-11 (today) and S-32 (backlog, up to 3 days back): the
 * only difference between them is which date this hook is given, and
 * checkinsRepository.upsert already derives manual-vs-backlog `source`
 * from that. `useTodayCheckIn` is this hook pinned to today.
 */
export function useCheckInForDate(targetDate: string): UseCheckInForDateResult {
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const existing = await checkinsRepository.getByDate(targetDate);
      setCheckIn(existing);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load that day.');
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (draft: Omit<CheckInDraft, 'localDate'>) => {
      setSaving(true);
      try {
        const today = todayLocalDate();
        const saved = await checkinsRepository.upsert({ ...draft, localDate: targetDate }, today);
        setCheckIn(saved);
        setError(null);
        // Fire-and-forget — never let a sync failure block the save
        // the user is waiting on (§1.1, the server never blocks).
        void pushPendingCheckIns();
        return saved;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save the check-in.');
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [targetDate],
  );

  return { checkIn, loading, saving, error, save, refresh };
}

import { useCallback, useEffect, useState } from 'react';

import { todayLocalDate } from '@/lib/localDate';

import { checkinsRepository } from './checkinsRepository';
import type { CheckIn, CheckInDraft } from './checkinsTypes';

interface UseTodayCheckInResult {
  checkIn: CheckIn | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  save: (draft: Omit<CheckInDraft, 'localDate'>) => Promise<CheckIn>;
  refresh: () => Promise<void>;
}

/** Reads/writes today's check-in from SQLite (the source of truth,
 * §1.1) — check-ins never go through Redux, only auth/session does. */
export function useTodayCheckIn(): UseTodayCheckInResult {
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const today = todayLocalDate();
      const existing = await checkinsRepository.getByDate(today);
      setCheckIn(existing);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load today.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (draft: Omit<CheckInDraft, 'localDate'>) => {
    setSaving(true);
    try {
      const today = todayLocalDate();
      const saved = await checkinsRepository.upsert({ ...draft, localDate: today }, today);
      setCheckIn(saved);
      setError(null);
      return saved;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the check-in.');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { checkIn, loading, saving, error, save, refresh };
}

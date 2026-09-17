import { useCallback, useEffect, useState } from 'react';

import { todayLocalDate } from '@/lib/localDate';

import { checkinsRepository } from './checkinsRepository';
import { buildMonthGrid, currentRun, type MonthCell } from './historyRules';

interface UseMonthHistoryResult {
  cells: MonthCell[];
  nightsLogged: number;
  run: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

/** Backs S-30 — reads the given month's check-ins from SQLite and
 * derives the calendar grid + summary stats via the pure historyRules
 * functions. year/month are 0-indexed month, JS Date convention. */
export function useMonthHistory(year: number, month: number): UseMonthHistoryResult {
  const [cells, setCells] = useState<MonthCell[]>([]);
  const [nightsLogged, setNightsLogged] = useState(0);
  const [run, setRun] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      const today = todayLocalDate();

      const checkIns = await checkinsRepository.listRange(start, end);
      const moodByDate = new Map(checkIns.map((c) => [c.localDate, c.mood]));
      const loggedDates = new Set(checkIns.map((c) => c.localDate));

      setCells(buildMonthGrid(year, month, moodByDate, today));
      setNightsLogged(checkIns.length);
      setRun(currentRun(loggedDates, today));
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { cells, nightsLogged, run, loading, refresh };
}

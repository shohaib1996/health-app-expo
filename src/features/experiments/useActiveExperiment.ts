import { useCallback, useEffect, useState } from 'react';

import { experimentsApi } from './experimentsApi';
import type { ActiveExperimentResponse } from './experimentsTypes';

interface UseActiveExperimentResult {
  experiment: ActiveExperimentResponse | null;
  loading: boolean;
  error: string | null;
  hasActive: boolean;
  refresh: () => Promise<void>;
}

/** GET /experiments/active 404s when nothing is running — that's not
 * an error state for this screen, just "no active experiment". */
export function useActiveExperiment(): UseActiveExperimentResult {
  const [experiment, setExperiment] = useState<ActiveExperimentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const active = await experimentsApi.getActive();
      setExperiment(active);
      setError(null);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setExperiment(null);
        setError(null);
      } else {
        setError(e instanceof Error ? e.message : 'Could not load your experiment.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { experiment, loading, error, hasActive: experiment !== null, refresh };
}

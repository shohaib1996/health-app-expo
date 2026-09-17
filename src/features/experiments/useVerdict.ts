import { useCallback, useEffect, useState } from 'react';

import { experimentsApi } from './experimentsApi';
import type { VerdictResponse } from './experimentsTypes';

export function useVerdict(experimentId: string | undefined) {
  const [verdict, setVerdict] = useState<VerdictResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!experimentId) return;
    setLoading(true);
    try {
      const result = await experimentsApi.getVerdict(experimentId);
      setVerdict(result);
      setError(null);
    } catch (e) {
      // 422 means verdict_due_on hasn't passed yet — server-enforced,
      // never rely on the client hiding it (spec: no outcome data
      // before the due date, no exceptions).
      setError(e instanceof Error ? e.message : 'The verdict is not ready yet.');
    } finally {
      setLoading(false);
    }
  }, [experimentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { verdict, loading, error, refresh };
}

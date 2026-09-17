import { useCallback, useEffect, useState } from 'react';

import { experimentsApi } from './experimentsApi';
import type { ExperimentHistoryItem } from './experimentsTypes';

export function useExperimentHistory() {
  const [items, setItems] = useState<ExperimentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await experimentsApi.list();
      setItems(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your experiments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}

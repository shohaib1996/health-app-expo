import { useCallback, useEffect, useState } from 'react';

import { patternsApi } from './patternsApi';
import type { Pattern } from './patternsTypes';

export function usePatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await patternsApi.list();
      setPatterns(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load patterns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { patterns, loading, error, refresh };
}

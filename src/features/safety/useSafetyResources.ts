import { useCallback, useEffect, useState } from 'react';

import { safetyApi } from './safetyApi';
import type { SafetyResourcesResponse } from './safetyTypes';

/** No hardcoded fallback numbers on-device, deliberately — the backend
 * team flagged an unverified crisis number as worse than none (see
 * docs/DECISIONS.md item D3/launch-blocker list). On failure this
 * surfaces a plain retry state, never an invented phone number. */
export function useSafetyResources(region?: string) {
  const [data, setData] = useState<SafetyResourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await safetyApi.getResources(region);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load resources.');
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

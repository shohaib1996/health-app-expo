import { useCallback, useEffect, useState } from 'react';

import { subscriptionsApi } from './subscriptionsApi';
import type { EntitlementResponse } from './subscriptionsTypes';

export function useEntitlement() {
  const [entitlement, setEntitlement] = useState<EntitlementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await subscriptionsApi.getEntitlement();
      setEntitlement(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your subscription.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { entitlement, loading, error, refresh };
}

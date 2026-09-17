import { useCallback, useEffect, useState } from 'react';

import { protocolsApi } from './protocolsApi';
import type { Protocol } from './protocolsTypes';

export function useProtocol(key: string | undefined) {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    try {
      const result = await protocolsApi.get(key);
      setProtocol(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this protocol.');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { protocol, loading, error, refresh };
}

import { useCallback, useEffect, useState } from 'react';

import { protocolsApi } from './protocolsApi';
import type { Protocol } from './protocolsTypes';

interface UseProtocolLibraryResult {
  groups: { domain: string; protocols: Protocol[] }[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** S-27 — the curated library, grouped by domain (Sleep, Movement,
 * Caffeine, ...). Server-backed, unlike check-ins/patterns: the
 * library is a shared catalog the backend seeds from YAML (§5.7), not
 * per-user device data. */
export function useProtocolLibrary(): UseProtocolLibraryResult {
  const [groups, setGroups] = useState<{ domain: string; protocols: Protocol[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const protocols = await protocolsApi.list();
      const byDomain = new Map<string, Protocol[]>();
      for (const protocol of protocols) {
        const list = byDomain.get(protocol.domain) ?? [];
        list.push(protocol);
        byDomain.set(protocol.domain, list);
      }
      setGroups(Array.from(byDomain, ([domain, list]) => ({ domain, protocols: list })));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { groups, loading, error, refresh };
}

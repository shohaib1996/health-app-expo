import { useCallback, useEffect, useState } from 'react';

import { memoryApi } from './memoryApi';
import type { MemoryCategory, MemoryEntry } from './memoryTypes';

export function useMemory() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await memoryApi.list();
      setEntries(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load what the app knows.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const byCategory = (category: MemoryCategory) => entries.filter((e) => e.category === category);

  return { entries, byCategory, loading, error, refresh };
}

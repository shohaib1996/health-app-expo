import { useCallback, useEffect, useState } from 'react';

import { usersApi } from './usersApi';
import type { UserResponse } from './userTypes';

export function useMe() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await usersApi.getMe();
      setUser(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your account.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { user, loading, error, refresh };
}

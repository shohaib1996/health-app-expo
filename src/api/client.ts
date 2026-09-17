import { create, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from '@/lib/env';
import { tokenStorage } from '@/lib/tokenStorage';

/**
 * One axios instance for the whole app. The backend is a sync target and
 * AI proxy, never a blocker (§1.1) — callers are expected to catch
 * network failures themselves and fall back to local (SQLite) state;
 * this client does not retry on network errors, only on a single 401.
 *
 * Imports `create` by name rather than `axios.create` — axios ships
 * both a default export and named exports for the same members, and
 * using the default risks a bundler/interop mismatch lint flags as
 * ambiguous. The named import is unambiguous either way.
 */
export const apiClient = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/** Set by the auth slice so a hard-failed refresh can log the user out
 * without this module importing the store (would create a cycle). */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

/** Set by the auth slice to perform the actual refresh call+token swap
 * without this module depending on the auth feature directly. */
let refreshTokens: (() => Promise<void>) | null = null;
export function setRefreshHandler(handler: () => Promise<void>): void {
  refreshTokens = handler;
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Refresh-once, queue-the-rest so concurrent 401s don't fire N refresh calls.
let refreshInFlight: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const status = error.response?.status;

    if (status !== 401 || !original || original._retried || !refreshTokens) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      refreshInFlight ??= refreshTokens().finally(() => {
        refreshInFlight = null;
      });
      await refreshInFlight;
      return apiClient(original);
    } catch (refreshError) {
      await tokenStorage.clear();
      onUnauthorized?.();
      return Promise.reject(refreshError);
    }
  },
);

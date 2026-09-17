import { setRefreshHandler, setUnauthorizedHandler } from '@/api/client';
import { authApi } from '@/features/auth/authApi';
import { sessionExpired } from '@/features/auth/authSlice';
import { tokenStorage } from '@/lib/tokenStorage';

import { store } from './index';

/**
 * Connects the axios client's 401-handling to the store and to
 * SecureStore, without the client module importing either directly
 * (keeps src/api/client.ts free of app-state dependencies). Called once
 * from the root layout.
 */
export function wireApiClient(): void {
  setRefreshHandler(async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available.');

    const tokens = await authApi.refresh({ refreshToken });
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
  });

  setUnauthorizedHandler(() => {
    store.dispatch(sessionExpired());
  });
}

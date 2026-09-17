import * as SecureStore from 'expo-secure-store';

/**
 * Access/refresh tokens live in SecureStore, not AsyncStorage or Redux
 * persist — they're credentials, not app state. Redux only ever holds
 * `isAuthenticated`/user fields; the tokens themselves are read here,
 * on demand, by the axios client.
 */
const ACCESS_TOKEN_KEY = 'hunch.accessToken';
const REFRESH_TOKEN_KEY = 'hunch.refreshToken';

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },
  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};

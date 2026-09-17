import Constants from 'expo-constants';

/**
 * API base URL. Expo public env vars must be prefixed EXPO_PUBLIC_ and
 * are inlined at build time — see .env.example. Falls back to the
 * `extra.apiUrl` app.json field, then localhost for dev.
 */
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:8000/api/v1';

import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stable per-install client_device_id. Not a secret (used only to make
 * `/auth/device` idempotent per §5.1), so plain AsyncStorage is fine —
 * SecureStore is reserved for tokens.
 */
const DEVICE_ID_KEY = 'hunch.clientDeviceId';

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const id = Crypto.randomUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

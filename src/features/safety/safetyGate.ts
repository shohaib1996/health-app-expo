import { router } from 'expo-router';

import { detect } from './detector';

/**
 * The guard every free-text/voice surface must run before doing
 * anything else with the input (G-5) — trip = redirect to S-60
 * immediately, don't save, don't call the network. Mirrors the
 * backend's pre-call ordering in ai/guards.py: the guard runs before
 * the thing it guards, not after.
 *
 * Returns true if it tripped (caller must abort), false if the text is
 * clear to proceed.
 */
export function guardFreeText(text: string | null | undefined): boolean {
  if (detect(text)) {
    router.push('/safety/interstitial');
    return true;
  }
  return false;
}

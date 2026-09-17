/** Mirrors app/modules/subscriptions/schemas.py. */

export type EntitlementTier = 'free' | 'pro';

export interface EntitlementResponse {
  tier: EntitlementTier;
  status: string;
  productId: string | null;
  currentPeriodEnd: string | null;
  willRenew: boolean;
}

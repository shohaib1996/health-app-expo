import { apiClient } from '@/api/client';

import type { EntitlementResponse } from './subscriptionsTypes';

export const subscriptionsApi = {
  getEntitlement: () => apiClient.get<EntitlementResponse>('/subscription').then((r) => r.data),
};

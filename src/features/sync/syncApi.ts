import { apiClient } from '@/api/client';

import type { SyncPushRequest, SyncPushResponse } from './syncTypes';

export const syncApi = {
  push: (payload: SyncPushRequest) => apiClient.post<SyncPushResponse>('/sync/push', payload).then((r) => r.data),
};

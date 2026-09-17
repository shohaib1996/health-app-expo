import { apiClient } from '@/api/client';

import type { Protocol } from './protocolsTypes';

export const protocolsApi = {
  list: (focusArea?: string) =>
    apiClient
      .get<Protocol[]>('/protocols', { params: focusArea ? { focus: focusArea } : undefined })
      .then((r) => r.data),

  get: (key: string) => apiClient.get<Protocol>(`/protocols/${key}`).then((r) => r.data),
};

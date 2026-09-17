import { apiClient } from '@/api/client';

import type { DeletionRequestCreate, DeletionRequestResponse, ExportJobResponse } from './privacyTypes';

export const privacyApi = {
  createExport: () => apiClient.post<ExportJobResponse>('/privacy/export').then((r) => r.data),

  getExport: (jobId: string) => apiClient.get<ExportJobResponse>(`/privacy/export/${jobId}`).then((r) => r.data),

  requestDeletion: (payload: DeletionRequestCreate) =>
    apiClient.delete<DeletionRequestResponse>('/privacy/data', { data: payload }).then((r) => r.data),
};

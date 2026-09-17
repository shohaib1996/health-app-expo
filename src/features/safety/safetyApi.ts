import { apiClient } from '@/api/client';

import type { SafetyReportCreate, SafetyReportResponse, SafetyResourcesResponse } from './safetyTypes';

/** GET /safety/resources takes no auth dependency on the backend (§5.10)
 * — it must work even if auth is broken. This client still attaches a
 * Bearer token when one exists (harmless; the server ignores it here),
 * so no special-casing is needed at this layer. */
export const safetyApi = {
  getResources: (region?: string) =>
    apiClient
      .get<SafetyResourcesResponse>('/safety/resources', { params: region ? { region } : undefined })
      .then((r) => r.data),

  report: (payload: SafetyReportCreate) =>
    apiClient.post<SafetyReportResponse>('/safety/report', payload).then((r) => r.data),
};

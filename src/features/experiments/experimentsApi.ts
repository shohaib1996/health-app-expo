import { apiClient } from '@/api/client';

import type {
  AbandonRequest,
  ActiveExperimentResponse,
  AdherenceMark,
  ExperimentCreate,
  ExperimentHistoryItem,
  ProposalResponse,
  ProposeRequest,
  VerdictResponse,
} from './experimentsTypes';

export const experimentsApi = {
  propose: (payload: ProposeRequest) =>
    apiClient.post<ProposalResponse>('/experiments/propose', payload).then((r) => r.data),

  getActive: () => apiClient.get<ActiveExperimentResponse>('/experiments/active').then((r) => r.data),

  list: (outcome?: string) =>
    apiClient
      .get<ExperimentHistoryItem[]>('/experiments', { params: outcome ? { outcome } : undefined })
      .then((r) => r.data),

  create: (payload: ExperimentCreate) =>
    apiClient.post<ActiveExperimentResponse>('/experiments', payload).then((r) => r.data),

  markAdherence: (experimentId: string, payload: AdherenceMark) =>
    apiClient
      .post<ActiveExperimentResponse>(`/experiments/${experimentId}/adherence`, payload)
      .then((r) => r.data),

  abandon: (experimentId: string, payload: AbandonRequest) =>
    apiClient
      .post<ActiveExperimentResponse>(`/experiments/${experimentId}/abandon`, payload)
      .then((r) => r.data),

  getVerdict: (experimentId: string) =>
    apiClient.get<VerdictResponse>(`/experiments/${experimentId}/verdict`).then((r) => r.data),
};

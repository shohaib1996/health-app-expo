import { apiClient } from '@/api/client';

import type { Pattern } from './patternsTypes';

export const patternsApi = {
  list: () => apiClient.get<Pattern[]>('/patterns').then((r) => r.data),
};

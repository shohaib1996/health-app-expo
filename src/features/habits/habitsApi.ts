import { apiClient } from '@/api/client';

import type { HabitCreate, HabitResponse, HabitUpdate } from './habitsTypes';

export const habitsApi = {
  install: (payload: HabitCreate) => apiClient.post<HabitResponse>('/habits', payload).then((r) => r.data),

  list: () => apiClient.get<HabitResponse[]>('/habits').then((r) => r.data),

  update: (habitId: string, payload: HabitUpdate) =>
    apiClient.patch<HabitResponse>(`/habits/${habitId}`, payload).then((r) => r.data),
};

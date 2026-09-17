import { apiClient } from '@/api/client';

import type { FocusAreasReplace, UserResponse, UserUpdate } from './userTypes';

export const usersApi = {
  getMe: () => apiClient.get<UserResponse>('/me').then((r) => r.data),

  updateMe: (payload: UserUpdate) => apiClient.patch<UserResponse>('/me', payload).then((r) => r.data),

  replaceFocusAreas: (payload: FocusAreasReplace) =>
    apiClient.put<UserResponse>('/me/focus-areas', payload).then((r) => r.data),
};

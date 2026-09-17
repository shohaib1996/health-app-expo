import { apiClient } from '@/api/client';

import type { DeviceRegisterRequest, LinkRequest, RefreshRequest, TokenResponse } from './authTypes';
import type { UserResponse } from '@/features/users/userTypes';

export const authApi = {
  registerDevice: (payload: DeviceRegisterRequest) =>
    apiClient.post<TokenResponse>('/auth/device', payload).then((r) => r.data),

  refresh: (payload: RefreshRequest) =>
    apiClient.post<TokenResponse>('/auth/refresh', payload).then((r) => r.data),

  link: (payload: LinkRequest) => apiClient.post<UserResponse>('/auth/link', payload).then((r) => r.data),

  revokeDevice: (clientDeviceId: string) =>
    apiClient.delete<void>('/auth/device', { params: { clientDeviceId } }).then((r) => r.data),
};

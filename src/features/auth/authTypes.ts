/** Mirrors app/modules/auth/schemas.py. Field names are camelCase on the
 * wire (BaseSchema's alias_generator=to_camel), so these match 1:1. */

export interface DeviceRegisterRequest {
  clientDeviceId: string;
  platform?: string | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  isAnonymous: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LinkRequest {
  provider: 'email';
  email: string;
  password: string;
}

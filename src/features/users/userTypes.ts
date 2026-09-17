/** Mirrors app/modules/users/schemas.py. */

export type FocusArea = 'sleep' | 'movement' | 'mood';

export interface UserResponse {
  id: string;
  isAnonymous: boolean;
  email: string | null;
  timezone: string;
  locale: string | null;
  ageVerified: boolean;
  focusAreas: FocusArea[];
  entitlement: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  timezone?: string;
  locale?: string;
}

export interface FocusAreasReplace {
  focusAreas: FocusArea[];
}

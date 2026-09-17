import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import onboardingReducer from '@/features/onboarding/onboardingSlice';
import settingsReducer from '@/features/settings/settingsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

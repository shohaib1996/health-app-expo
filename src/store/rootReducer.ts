import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import onboardingReducer from '@/features/onboarding/onboardingSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

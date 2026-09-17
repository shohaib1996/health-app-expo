import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  completed: boolean;
  /** Set permanently on an under-17 date of birth (S-03) — persisted so
   * a reinstall-free retry within the same install can't route around
   * the age gate, per the spec's hard rule. */
  blockedUnderAge: boolean;
}

const initialState: OnboardingState = {
  completed: false,
  blockedUnderAge: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeOnboarding(state) {
      state.completed = true;
    },
    blockUnderAge(state) {
      state.blockedUnderAge = true;
    },
  },
});

export const { completeOnboarding, blockUnderAge } = onboardingSlice.actions;
export default onboardingSlice.reducer;

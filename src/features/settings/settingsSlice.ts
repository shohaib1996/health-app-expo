import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  /** 'HH:mm', 24h. No scheduling is wired to this yet — see S-06/S-52's
   * screen comments; expo-notifications isn't installed. This is
   * real, persisted user intent, stored ahead of the feature that
   * will act on it. */
  reminderTime: string | null;
  eventNotificationsEnabled: boolean;
}

const initialState: SettingsState = {
  reminderTime: '21:30',
  eventNotificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setReminderTime(state, action: PayloadAction<string | null>) {
      state.reminderTime = action.payload;
    },
    setEventNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.eventNotificationsEnabled = action.payload;
    },
  },
});

export const { setReminderTime, setEventNotificationsEnabled } = settingsSlice.actions;
export default settingsSlice.reducer;

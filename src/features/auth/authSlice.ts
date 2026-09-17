import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getOrCreateDeviceId } from '@/lib/deviceId';
import { tokenStorage } from '@/lib/tokenStorage';

import { authApi } from './authApi';

interface AuthState {
  userId: string | null;
  isAnonymous: boolean;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  isAnonymous: true,
  status: 'idle',
  error: null,
};

/** Anonymous-first (§5.1): called on cold start with no session yet. */
export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const clientDeviceId = await getOrCreateDeviceId();
  const existingAccess = await tokenStorage.getAccessToken();
  if (existingAccess) {
    // A prior session's tokens are already in SecureStore; nothing to do
    // here — the caller (users slice) fetches /me to confirm they're live.
    return { userId: null, isAnonymous: true, alreadySignedIn: true };
  }

  const tokens = await authApi.registerDevice({ clientDeviceId });
  await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
  return { userId: tokens.userId, isAnonymous: tokens.isAnonymous, alreadySignedIn: false };
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await tokenStorage.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      state.status = 'unauthenticated';
      state.userId = null;
    },
    setIdentity(state, action: PayloadAction<{ userId: string; isAnonymous: boolean }>) {
      state.userId = action.payload.userId;
      state.isAnonymous = action.payload.isAnonymous;
      state.status = 'authenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        if (!action.payload.alreadySignedIn) {
          state.userId = action.payload.userId;
          state.isAnonymous = action.payload.isAnonymous;
        }
        state.status = 'authenticated';
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Could not start a session.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.userId = null;
        state.isAnonymous = true;
        state.status = 'unauthenticated';
      });
  },
});

export const { sessionExpired, setIdentity } = authSlice.actions;
export default authSlice.reducer;

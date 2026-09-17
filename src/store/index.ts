import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { rootReducer } from './rootReducer';

/**
 * Tokens never go through redux-persist — they live in SecureStore
 * (src/lib/tokenStorage.ts). Redux only persists non-sensitive identity
 * flags so the UI doesn't flash "signed out" on a cold start.
 */
const persistConfig = {
  key: 'hunch-root',
  storage: AsyncStorage,
  whitelist: ['auth', 'onboarding'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState } from './rootReducer';

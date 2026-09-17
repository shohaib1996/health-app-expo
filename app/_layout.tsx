import '@/design/global.css';

import { Inter_400Regular, Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { colors } from '@/design/tokens';
import { bootstrapAuth } from '@/features/auth/authSlice';
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { persistor, store } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { wireApiClient } from '@/store/wireApiClient';

SplashScreen.preventAutoHideAsync();
wireApiClient();
void store.dispatch(bootstrapAuth());

function AppShell() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium });
  const onboardingCompleted = useAppSelector((s) => s.onboarding.completed);
  const blockedUnderAge = useAppSelector((s) => s.onboarding.blockedUnderAge);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Onboarding (and the permanent under-17 block) renders as a plain
  // component tree, not a route — see OnboardingFlow.tsx for why.
  if (blockedUnderAge || !onboardingCompleted) {
    return (
      <View className="flex-1 bg-bg">
        <StatusBar style="light" />
        <OnboardingFlow />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="checkin/index" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="checkin/saved"
          options={{ presentation: 'transparentModal', animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="library/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="safety/resources" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="safety/interstitial"
          options={{ presentation: 'fullScreenModal', gestureEnabled: false, animation: 'fade' }}
        />
        <Stack.Screen name="privacy/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="privacy/export" />
        <Stack.Screen name="privacy/delete" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppShell />
      </PersistGate>
    </Provider>
  );
}

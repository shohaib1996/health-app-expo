import '@/design/global.css';

import { Inter_400Regular, Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { colors } from '@/design/tokens';
import { bootstrapAuth } from '@/features/auth/authSlice';
import { checkinsRepository } from '@/features/checkins/checkinsRepository';
import { WelcomeBack } from '@/features/checkins/WelcomeBack';
import { classifyGap, daysBetween, type GapKind } from '@/features/checkins/welcomeBackRules';
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { pullServerCheckIns, pushPendingCheckIns } from '@/features/sync/syncService';
import { todayLocalDate } from '@/lib/localDate';
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
  const [gap, setGap] = useState<{ kind: GapKind; days: number } | null>(null);
  const [gapDismissed, setGapDismissed] = useState(false);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Evaluated once per cold start, only once onboarding is behind us —
  // a gap check during onboarding itself would be meaningless.
  useEffect(() => {
    if (!fontsLoaded || blockedUnderAge || !onboardingCompleted) return;
    void (async () => {
      // Pull first, so a fresh install/second device recovers server
      // history before the gap check runs against it — otherwise a
      // user with real history would briefly see 'nothing logged'.
      await pullServerCheckIns();
      const lastDate = await checkinsRepository.getMostRecentDate();
      const days = lastDate ? daysBetween(lastDate, todayLocalDate()) : null;
      setGap({ kind: classifyGap(days), days: days ?? 0 });
      // Best-effort catch-up push, in addition to the one that fires
      // after every save — covers rows that failed to push earlier
      // (offline, server down) and were never retried.
      void pushPendingCheckIns();
    })();
  }, [fontsLoaded, blockedUnderAge, onboardingCompleted]);

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

  // S-70/S-71 — an interrupt over the tabs shell, shown at most once
  // per cold start (gapDismissed), same non-route pattern as
  // onboarding: there's nothing to navigate back into.
  if (gap && gap.kind !== 'none' && !gapDismissed) {
    return (
      <View className="flex-1 bg-bg">
        <StatusBar style="light" />
        <WelcomeBack kind={gap.kind} daysSince={gap.days} onContinue={() => setGapDismissed(true)} />
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
        <Stack.Screen name="history/experiments" options={{ presentation: 'modal' }} />
        <Stack.Screen name="history/day" options={{ presentation: 'modal' }} />
        <Stack.Screen name="memory/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="memory/edit" />
        <Stack.Screen name="account/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="patterns/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="pattern/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="pattern/not-enough-data" options={{ presentation: 'modal' }} />
        <Stack.Screen name="about/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="health/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reminders/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="subscription/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall/index" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppShell />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

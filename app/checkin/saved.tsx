import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { pickSavedVariant } from '@/features/checkins/savedCardRules';

const AUTO_DISMISS_MS = 2500;

/**
 * S-14 — the reward delivered in the same second as the action, not a
 * weekly digest. Auto-dismisses back to Today; a tap dismisses early.
 * "New pattern found" (the spec's top-priority variant) waits on the
 * on-device pattern engine — see savedCardRules.ts.
 */
export default function CheckInSavedScreen() {
  const { nightsLogged: nightsLoggedParam } = useLocalSearchParams<{ nightsLogged: string }>();
  const nightsLogged = Number(nightsLoggedParam ?? '0');
  const variant = pickSavedVariant(nightsLogged);

  const headline = variant.kind === 'milestone' ? variant.message : 'Logged.';
  const detail =
    variant.kind === 'ordinary' && variant.message !== 'Logged.'
      ? variant.message.replace(/^Logged\.\s*/, '')
      : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.dismissAll();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable className="flex-1" onPress={() => router.dismissAll()}>
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-8">
        <View className="h-11 w-11 items-center justify-center rounded-default border border-neutral-600">
          <Text className="font-heading text-h5 text-neutral-400">✓</Text>
        </View>
        <Text className="mt-6 text-center font-heading text-h4 text-text">{headline}</Text>
        {detail && <Text className="mt-2 text-center font-body text-body-sm text-neutral-400">{detail}</Text>}
      </SafeAreaView>
    </Pressable>
  );
}

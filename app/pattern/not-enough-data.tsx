import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui';
import { checkinsRepository } from '@/features/checkins/checkinsRepository';
import { useTodayCheckIn } from '@/features/checkins/useTodayCheckIn';
import { useActiveExperiment } from '@/features/experiments/useActiveExperiment';

const PATTERN_THRESHOLD_NIGHTS = 21;

/**
 * S-17 — turns the cold start into a visible countdown instead of
 * hiding it. Real counts, never a percentage alone (percentages hide
 * how close "close" actually is) and never the word "loading" or
 * "coming soon".
 */
export default function NotEnoughDataScreen() {
  const { experiment } = useActiveExperiment();
  const { checkIn } = useTodayCheckIn();
  const [nightsLogged, setNightsLogged] = useState<number | null>(null);

  useEffect(() => {
    void checkinsRepository.countLoggedNights().then(setNightsLogged);
  }, [checkIn]);

  const remaining = nightsLogged === null ? null : Math.max(0, PATTERN_THRESHOLD_NIGHTS - nightsLogged);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">Not enough data yet</Text>

        {nightsLogged !== null && (
          <View className="mt-6">
            <Text className="font-heading text-h2 tabular-nums text-neutral-500">
              {nightsLogged} of {PATTERN_THRESHOLD_NIGHTS}
            </Text>
            <Text className="mt-1 font-body text-body-sm text-neutral-400">nights logged</Text>
          </View>
        )}

        <Text className="mt-6 font-body text-body text-neutral-400">
          Patterns need about three weeks of nights before they mean anything. Anything shorter is guesswork,
          and this app does not guess.
        </Text>

        {remaining !== null && remaining > 0 && (
          <Text className="mt-3 font-body text-body-sm text-neutral-500">{remaining} more nights to go.</Text>
        )}

        {experiment && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            Meanwhile, {experiment.protocolName} is still running — keep marking your nights.
          </Text>
        )}
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

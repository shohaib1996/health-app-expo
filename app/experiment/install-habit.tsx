import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, Chip } from '@/components/ui';
import { habitsApi } from '@/features/habits/habitsApi';
import type { MaintenanceFrequency } from '@/features/habits/habitsTypes';

const FREQUENCIES: Array<{ value: MaintenanceFrequency; label: string }> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'none', label: 'Not at all' },
];

/**
 * S-26 — graduation is a success state (spec's framing, citing the
 * APA advisory and the MIT/OpenAI RCT): the goal is to reduce the
 * app's own presence once a behavior is confirmed, not deepen
 * engagement. Reached from S-24's 'Keep doing this' on a worked
 * verdict.
 */
export default function InstallHabitScreen() {
  const { protocolKey, protocolName, experimentId } = useLocalSearchParams<{
    protocolKey: string;
    protocolName: string;
    experimentId?: string;
  }>();
  const [frequency, setFrequency] = useState<MaintenanceFrequency>('none');
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await habitsApi.install({
        clientId: Crypto.randomUUID(),
        protocolKey,
        sourceExperimentId: experimentId ?? null,
        maintenanceFrequency: frequency,
      });
      router.dismissTo('/(tabs)');
    } catch {
      Alert.alert("Couldn't install", 'Check your connection and try again.');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">
          {protocolName} is now part of your routine.
        </Text>
        <Text className="mt-3 font-body text-body-sm text-neutral-400">
          You don't need to log this daily any more. How often, if at all, should this check in on
          you?
        </Text>
        <View className="mt-6 flex-row flex-wrap gap-2">
          {FREQUENCIES.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={frequency === option.value}
              onPress={() => setFrequency(option.value)}
            />
          ))}
        </View>
      </View>
      <View className="pb-4">
        <Button label={installing ? 'Saving…' : 'Done'} onPress={handleInstall} disabled={installing} block />
      </View>
    </SafeAreaView>
  );
}

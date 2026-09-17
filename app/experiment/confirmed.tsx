import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/ui';
import { formatLocalDateLong } from '@/lib/localDate';

/**
 * S-22 — closes the loop with a dated promise. No accent: starting an
 * experiment is a commitment, not a result yet. Ownership framing
 * ("your experiment is reserved") per the spec, not "Good luck!".
 */
export default function ExperimentConfirmedScreen() {
  const { protocolName, verdictDueOn } = useLocalSearchParams<{
    protocolName: string;
    verdictDueOn: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-bg px-8" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-center font-heading text-h3 text-text">Your experiment starts today.</Text>
        <Text className="mt-3 text-center font-body text-body text-neutral-400">
          {protocolName ? `${protocolName} — ` : ''}
          I'll check in each night and tell you on {formatLocalDateLong(verdictDueOn ?? '')} whether it worked.
        </Text>
      </View>
      <View className="pb-4">
        <Button label="Done" onPress={() => router.dismissAll()} block />
      </View>
    </SafeAreaView>
  );
}

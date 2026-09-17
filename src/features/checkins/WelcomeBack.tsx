import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { formatLocalDateLong, todayLocalDate } from '@/lib/localDate';

import type { GapKind } from './welcomeBackRules';

interface WelcomeBackProps {
  kind: Exclude<GapKind, 'none'>;
  daysSince: number;
  onContinue: () => void;
}

/**
 * S-70 (short gap) / S-71 (long gap). No guilt copy, no broken-streak
 * graphics, no "we missed you" — the spec forbids all three
 * explicitly. A short gap barely comments on itself; a long gap uses
 * fresh-start framing and states plainly that nothing was lost.
 */
export function WelcomeBack({ kind, daysSince, onContinue }: WelcomeBackProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg px-8">
      <View className="flex-1 justify-center">
        {kind === 'short' ? (
          <>
            <Text className="font-heading text-h3 text-text">You're back.</Text>
            <Text className="mt-3 font-body text-body text-neutral-400">
              {daysSince} days since the last entry — everything's still here.
            </Text>
          </>
        ) : (
          <>
            <Text className="font-heading text-h3 text-text">It's {formatLocalDateLong(todayLocalDate())}.</Text>
            <Text className="mt-3 font-body text-body text-neutral-400">
              Good time to start again. Your past data is still here — nothing was lost.
            </Text>
          </>
        )}
      </View>
      <View className="pb-6">
        <Button label={kind === 'short' ? 'Check in' : 'Start tonight’s check-in'} onPress={onContinue} block />
      </View>
    </SafeAreaView>
  );
}

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, HeroNumber } from '@/components/ui';
import { toVerdictDisplay } from '@/features/experiments/verdictRules';
import { useVerdict } from '@/features/experiments/useVerdict';

/**
 * S-24 — the payoff, the whole product. All three verdict types get
 * equal design weight: same hero slot, same type scale, same
 * likely-range line. Only "worked" carries the accent — "didn't work"
 * and "inconclusive" are their own confident designs in neutral ink,
 * never "worked with the colour drained out." Share is available on
 * all three; a negative result is the most valuable thing the app
 * produces (spec's framing, not a throwaway line).
 */
export default function VerdictScreen() {
  const { experimentId } = useLocalSearchParams<{ experimentId: string }>();
  const { verdict, loading, error } = useVerdict(experimentId);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg">
        <Text className="font-body text-body-sm text-neutral-400">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (error || !verdict) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">
          {error ?? "This verdict isn't ready yet."}
        </Text>
      </SafeAreaView>
    );
  }

  const display = toVerdictDisplay(verdict);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-body text-text">{verdict.protocolName}</Text>
        <Text className="mt-1 font-body text-caption text-neutral-500">
          {verdict.durationDays} days · {verdict.keptDays} of {verdict.durationDays} kept
        </Text>

        <View className="mt-6">
          <Text className="font-heading text-h4 text-text">{display.headline}</Text>
        </View>

        <View className="mt-4">
          <HeroNumber value={display.heroValue} unit={display.heroUnit} likelyRange={display.likelyRange} role={display.role} />
        </View>

        {(verdict.beforeAverage !== null || verdict.duringAverage !== null) && (
          <View className="mt-6 gap-0">
            {verdict.beforeAverage !== null && (
              <Row label="Before" value={String(Math.round(verdict.beforeAverage))} />
            )}
            {verdict.duringAverage !== null && (
              <Row label="During" value={String(Math.round(verdict.duringAverage))} />
            )}
            {verdict.secondaryMetric && (
              <Row
                label={verdict.secondaryMetric}
                value={verdict.secondaryChanged ? 'changed' : 'no clear change'}
              />
            )}
          </View>
        )}

        {verdict.reason && (
          <Text className="mt-6 font-body text-body-sm text-neutral-300">{verdict.reason}</Text>
        )}
      </ScrollView>

      <View className="gap-2 px-6 pb-4">
        <Button
          label={verdict.verdictType === 'worked' ? 'Keep doing this' : "What's next"}
          onPress={() => {
            if (verdict.verdictType === 'worked') {
              router.push({
                pathname: '/experiment/install-habit',
                params: {
                  protocolKey: verdict.protocolKey,
                  protocolName: verdict.protocolName,
                  experimentId: verdict.id,
                },
              });
            } else {
              router.push('/library');
            }
          }}
          block
        />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-neutral-800 py-2.5">
      <Text className="font-body text-caption text-neutral-500">{label}</Text>
      <Text className="font-body text-caption tabular-nums text-text">{value}</Text>
    </View>
  );
}

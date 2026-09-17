import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, HeroNumber } from '@/components/ui';
import { LABEL_BY_PATTERN_STATE, ROLE_BY_PATTERN_STATE } from '@/features/patterns/patternDisplay';
import { usePatterns } from '@/features/patterns/usePatterns';
import { formatLocalDateLong } from '@/lib/localDate';

/**
 * S-16 — full inspectability. This screen exists to answer "is the
 * app making this up," so every underlying night is listed, never
 * hidden behind the headline number. Same hero slot, type scale and
 * token roles as S-24; only 'supported' carries the accent.
 */
export default function PatternDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { patterns, loading } = usePatterns();
  const pattern = patterns.find((p) => p.id === id);

  if (loading) return null;

  if (!pattern) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">Pattern not found.</Text>
      </SafeAreaView>
    );
  }

  const role = ROLE_BY_PATTERN_STATE[pattern.state];
  const heroValue = pattern.effectSummary ?? (pattern.n !== null ? `n = ${pattern.n}` : '—');

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-body text-text">{pattern.headline}</Text>

        <View className="mt-4">
          <HeroNumber
            value={heroValue}
            unit={LABEL_BY_PATTERN_STATE[pattern.state]}
            likelyRange={pattern.n !== null ? `Based on ${pattern.n} nights` : ''}
            role={role}
          />
        </View>

        <Text className="mt-6 font-body text-caption text-neutral-500">
          This is a pattern, not a cause. Something else could explain both.
        </Text>

        {pattern.rows.length > 0 && (
          <View className="mt-8">
            <Text className="font-heading text-h6 text-neutral-400">The nights this is based on</Text>
            <View className="mt-2">
              {pattern.rows.map((row) => (
                <View
                  key={row.localDate}
                  className="flex-row items-center justify-between border-b border-neutral-800 py-2.5"
                >
                  <Text className="font-body text-caption text-neutral-500">
                    {formatLocalDateLong(row.localDate)}
                  </Text>
                  <Text className="font-body text-caption tabular-nums text-text">{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

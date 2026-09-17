import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, ConfidenceDot } from '@/components/ui';
import { LABEL_BY_PATTERN_STATE, ROLE_BY_PATTERN_STATE } from '@/features/patterns/patternDisplay';
import { usePatterns } from '@/features/patterns/usePatterns';
import type { Pattern, PatternState } from '@/features/patterns/patternsTypes';

const GROUP_ORDER: PatternState[] = ['supported', 'inconclusive', 'insufficient_data'];

/**
 * S-33 — full list, grouped by confidence. "Tested, no clear answer"
 * must be as prominent as "Holds up" — an app that only shows its
 * wins is exactly what this product differentiates against (spec's
 * framing). Empty entirely until the on-device pattern engine exists
 * and syncs (Decisions doc §6) — that's expected, not a bug here.
 */
export default function AllPatternsScreen() {
  const { patterns, loading, error } = usePatterns();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">All patterns</Text>

        {loading && <Text className="mt-6 font-body text-body-sm text-neutral-400">Loading…</Text>}
        {!loading && error && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">Couldn't load patterns.</Text>
        )}
        {!loading && !error && patterns.length === 0 && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            Still collecting. Patterns need about three weeks of nights before they mean anything.
          </Text>
        )}

        {!loading &&
          !error &&
          GROUP_ORDER.map((state) => {
            const items = patterns.filter((p) => p.state === state);
            if (items.length === 0) return null;
            return (
              <View key={state} className="mt-6">
                <Text className="font-heading text-h6 text-neutral-400">
                  {LABEL_BY_PATTERN_STATE[state]} ({items.length})
                </Text>
                <View className="mt-2">
                  {items.map((pattern) => (
                    <PatternRow key={pattern.id} pattern={pattern} />
                  ))}
                </View>
              </View>
            );
          })}
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

function PatternRow({ pattern }: { pattern: Pattern }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/pattern/[id]', params: { id: pattern.id } })}
      className="flex-row items-center gap-2.5 border-b border-neutral-800 py-3"
    >
      <ConfidenceDot role={ROLE_BY_PATTERN_STATE[pattern.state]} />
      <Text className="flex-1 font-body text-body-sm text-text">{pattern.headline}</Text>
    </Pressable>
  );
}

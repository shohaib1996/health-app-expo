import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, Chip, ConfidenceDot } from '@/components/ui';
import type { ConfidenceRole } from '@/components/ui/ConfidenceDot';
import { useExperimentHistory } from '@/features/experiments/useExperimentHistory';
import type { ExperimentHistoryItem, VerdictType } from '@/features/experiments/experimentsTypes';

const ROLE_BY_VERDICT: Record<VerdictType, ConfidenceRole> = {
  worked: 'supported',
  didnt_work: 'noEffect',
  inconclusive: 'insufficientData',
};

const LABEL_BY_VERDICT: Record<VerdictType, string> = {
  worked: 'Worked',
  didnt_work: "Didn't work",
  inconclusive: 'Inconclusive',
};

type Filter = 'all' | VerdictType;

/**
 * S-34 — chronological, filterable by outcome. A user who has run
 * several experiments and sees mostly negatives has something no
 * competitor gives them; this list is meant to read like a lab
 * notebook, not a trophy case (spec's framing).
 */
export default function ExperimentHistoryScreen() {
  const { items, loading, error } = useExperimentHistory();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = items.filter((item) => filter === 'all' || item.verdictType === filter);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">Past experiments</Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label="Worked" selected={filter === 'worked'} onPress={() => setFilter('worked')} />
          <Chip
            label="Didn't work"
            selected={filter === 'didnt_work'}
            onPress={() => setFilter('didnt_work')}
          />
          <Chip
            label="Inconclusive"
            selected={filter === 'inconclusive'}
            onPress={() => setFilter('inconclusive')}
          />
        </View>

        {loading && <Text className="mt-6 font-body text-body-sm text-neutral-400">Loading…</Text>}
        {!loading && error && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            Couldn't load your experiments.
          </Text>
        )}
        {!loading && !error && filtered.length === 0 && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            {items.length === 0 ? 'No experiments run yet.' : 'Nothing matches that filter.'}
          </Text>
        )}

        <View className="mt-4">
          {filtered.map((item) => (
            <ExperimentRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

function ExperimentRow({ item }: { item: ExperimentHistoryItem }) {
  const canOpen = item.verdictType !== null;
  return (
    <Pressable
      disabled={!canOpen}
      onPress={() => router.push({ pathname: '/experiment/verdict', params: { experimentId: item.id } })}
      className="flex-row items-center justify-between border-b border-neutral-800 py-3.5"
    >
      <View className="flex-1 pr-3">
        <Text className="font-body text-body-sm text-text">{item.protocolName}</Text>
        <Text className="mt-0.5 font-body text-caption text-neutral-500">{item.startDate}</Text>
      </View>
      {item.verdictType && (
        <View className="flex-row items-center gap-2">
          <ConfidenceDot role={ROLE_BY_VERDICT[item.verdictType]} />
          <Text className="font-body text-caption text-neutral-400">
            {LABEL_BY_VERDICT[item.verdictType]}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

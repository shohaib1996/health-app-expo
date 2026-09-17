import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, TextField } from '@/components/ui';
import { experimentsApi } from '@/features/experiments/experimentsApi';
import { useActiveExperiment } from '@/features/experiments/useActiveExperiment';
import { guardFreeText } from '@/features/safety/safetyGate';
import { formatLocalDateLong, todayLocalDate } from '@/lib/localDate';

const DAY_CELL_CLASS: Record<'done' | 'missed' | 'not_yet', string> = {
  done: 'bg-neutral-600',
  missed: 'border border-neutral-700',
  not_yet: 'border border-neutral-800',
};

/**
 * S-23 — adherence only, never an interim outcome. No sleep numbers,
 * no running effect estimate: peeking at outcomes mid-experiment would
 * bias the eventual verdict. A missed day is a data point, not a
 * failure — never framed as broken.
 */
export default function ActiveExperimentScreen() {
  const { experiment, loading, error, hasActive, refresh } = useActiveExperiment();
  const [marking, setMarking] = useState(false);
  const [abandoning, setAbandoning] = useState(false);
  const [showAbandonForm, setShowAbandonForm] = useState(false);
  const [abandonReason, setAbandonReason] = useState('');

  const handleMarkToday = async () => {
    if (!experiment) return;
    setMarking(true);
    try {
      await experimentsApi.markAdherence(experiment.id, { localDate: todayLocalDate(), kept: true });
      await refresh();
    } catch {
      Alert.alert("Couldn't save", 'That day was not marked. Try again.');
    } finally {
      setMarking(false);
    }
  };

  const handleConfirmAbandon = async () => {
    if (!experiment || !abandonReason.trim()) return;
    // G-5: crisis detection runs on every free-text input, this field
    // included. Trip = redirect immediately, never submit the reason.
    if (guardFreeText(abandonReason)) return;
    setAbandoning(true);
    try {
      await experimentsApi.abandon(experiment.id, { reason: abandonReason.trim() });
      router.back();
    } catch {
      Alert.alert("Couldn't abandon", 'Try again.');
    } finally {
      setAbandoning(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg">
        <Text className="font-body text-body-sm text-neutral-400">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">
          Couldn't load your experiment. Check your connection and try again.
        </Text>
      </SafeAreaView>
    );
  }

  if (!hasActive || !experiment) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">No experiment is running.</Text>
      </SafeAreaView>
    );
  }

  const statusLine =
    experiment.missedDays === 0
      ? `Day ${experiment.dayNumber} of ${experiment.durationDays}.`
      : `${experiment.keptDays} of ${experiment.dayNumber} so far. That's still enough to learn something.`;
  const verdictReady = todayLocalDate() >= experiment.verdictDueOn;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">{experiment.protocolName}</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          When {experiment.cueText}, {experiment.actionText}.
        </Text>

        <Text className="mt-6 font-body text-body-sm text-neutral-400">{statusLine}</Text>
        <Text className="mt-1 font-body text-caption text-neutral-500">
          Verdict {formatLocalDateLong(experiment.verdictDueOn)}
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {experiment.adherence.map((day) => (
            <View key={day.localDate} className={`h-6 w-6 rounded-default ${DAY_CELL_CLASS[day.state]}`} />
          ))}
        </View>

        {showAbandonForm && (
          <View className="mt-6 gap-3">
            <TextField
              label="Why isn't this working?"
              value={abandonReason}
              onChangeText={setAbandonReason}
              placeholder="One line is enough"
              multiline
            />
            <Button
              label={abandoning ? 'Ending…' : 'Confirm — end this experiment'}
              variant="secondary"
              onPress={handleConfirmAbandon}
              disabled={abandoning || !abandonReason.trim()}
              block
            />
          </View>
        )}
      </ScrollView>

      <View className="gap-2 px-6 pb-4">
        {verdictReady ? (
          <Button
            label="See the verdict"
            onPress={() =>
              router.push({ pathname: '/experiment/verdict', params: { experimentId: experiment.id } })
            }
            block
          />
        ) : (
          <Button
            label={marking ? 'Saving…' : 'Mark today done'}
            onPress={handleMarkToday}
            disabled={marking}
            block
          />
        )}
        {!showAbandonForm && !verdictReady && (
          <Button
            label="This isn't working for me"
            variant="ghost"
            onPress={() => setShowAbandonForm(true)}
            block
          />
        )}
      </View>
    </SafeAreaView>
  );
}

import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, TextField } from '@/components/ui';
import { experimentsApi } from '@/features/experiments/experimentsApi';
import { useProtocol } from '@/features/protocols/useProtocol';
import { addDaysToLocalDate, formatLocalDateLong, todayLocalDate } from '@/lib/localDate';

/**
 * S-21 — the highest-evidence screen in the spec: an implementation
 * intention (d=0.65 across 94 tests), so both fields must be editable,
 * not just a confirm button on AI-authored text. No accent — this is
 * a plan, not a result yet.
 */
export default function PlanBuilderScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { protocol, loading, error } = useProtocol(key);
  const [cueText, setCueText] = useState('');
  const [actionText, setActionText] = useState('');
  const [starting, setStarting] = useState(false);

  // Suggestions arrive once the protocol loads; only seed local state
  // the first time so the user's own edits are never clobbered.
  const [seeded, setSeeded] = useState(false);
  if (protocol && !seeded) {
    setCueText(protocol.cueSuggestion);
    setActionText(protocol.actionSuggestion);
    setSeeded(true);
  }

  const startDate = todayLocalDate();
  const verdictPreview = protocol ? addDaysToLocalDate(startDate, protocol.durationDays) : null;

  const handleStart = async () => {
    if (!protocol) return;
    if (!cueText.trim() || !actionText.trim()) {
      Alert.alert('Fill in both fields', 'When and I will can’t be empty.');
      return;
    }
    setStarting(true);
    try {
      const created = await experimentsApi.create({
        clientId: Crypto.randomUUID(),
        protocolKey: protocol.key,
        cueText: cueText.trim(),
        actionText: actionText.trim(),
        startDate,
      });
      router.replace({
        pathname: '/experiment/confirmed',
        params: { protocolName: created.protocolName, verdictDueOn: created.verdictDueOn },
      });
    } catch {
      Alert.alert("Couldn't start this experiment", 'Check your connection and try again.');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg">
        <Text className="font-body text-body-sm text-neutral-400">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (error || !protocol) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">
          Couldn't load this protocol. Go back and try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">Your plan</Text>

        <TextField
          label="When"
          value={cueText}
          onChangeText={setCueText}
          multiline
          className="mt-6"
          placeholder="e.g. my 21:45 alarm goes off"
        />
        <TextField
          label="I will"
          value={actionText}
          onChangeText={setActionText}
          multiline
          className="mt-6"
          placeholder="e.g. put my phone on the charger in the hallway"
        />

        <View className="mt-6">
          <Text className="font-body text-body-sm text-neutral-400">
            For {protocol.durationDays} days.
          </Text>
          {verdictPreview && (
            <Text className="mt-1 font-body text-body-sm text-neutral-400">
              Verdict: {formatLocalDateLong(verdictPreview)}.
            </Text>
          )}
        </View>
      </ScrollView>

      <View className="px-6 pb-4">
        <Button label={starting ? 'Starting…' : 'Start'} onPress={handleStart} disabled={starting} block />
      </View>
    </SafeAreaView>
  );
}

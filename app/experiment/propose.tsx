import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui';
import { experimentsApi } from '@/features/experiments/experimentsApi';
import type { ProposalResponse } from '@/features/experiments/experimentsTypes';

const MAX_ALTERNATIVES = 3;

/**
 * S-20 — one proposal at a time, drawn from the curated library by
 * ID. Rules-based (focus areas only), not pattern-based — the
 * personalized 'hypothesis' framing in the mockups needs the
 * on-device pattern engine, which doesn't exist yet (Decisions doc
 * §6); proposal_service.py is explicit that this is honest,
 * library-level content only, and this screen's copy matches that.
 */
export default function ProposeExperimentScreen() {
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [excludeKeys, setExcludeKeys] = useState<string[]>([]);
  const [alternativesShown, setAlternativesShown] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = async (exclude: string[]) => {
    setLoading(true);
    try {
      const result = await experimentsApi.propose({ excludeKeys: exclude });
      setProposal(result);
      setError(null);
    } catch {
      setProposal(null);
      setError('No more protocols to propose right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProposal([]);
  }, []);

  const handleSomethingElse = () => {
    if (!proposal) return;
    if (alternativesShown >= MAX_ALTERNATIVES) {
      router.replace('/library');
      return;
    }
    const nextExclude = [...excludeKeys, proposal.protocolKey];
    setExcludeKeys(nextExclude);
    setAlternativesShown((n) => n + 1);
    void fetchProposal(nextExclude);
  };

  const handleSetUp = () => {
    if (!proposal) return;
    router.push({ pathname: '/experiment/plan', params: { key: proposal.protocolKey } });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg">
        <Text className="font-body text-body-sm text-neutral-400">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (error || !proposal) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">
          {error ?? "Couldn't load a proposal."}
        </Text>
        <View className="mt-6 w-full">
          <Button label="Browse the library instead" onPress={() => router.replace('/library')} block />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">{proposal.name}</Text>
        <Text className="mt-3 font-body text-body text-neutral-400">
          For {proposal.durationDays} days: {proposal.cueSuggestion} — {proposal.actionSuggestion}.
        </Text>
        <Text className="mt-4 font-body text-body-sm text-neutral-500">{proposal.whyThisOne}</Text>
        {proposal.contraindications.length > 0 && (
          <Text className="mt-4 font-body text-caption text-neutral-600">
            Not for: {proposal.contraindications.join(', ')}
          </Text>
        )}
      </View>
      <View className="gap-2 pb-4">
        <Button label="Set this up" onPress={handleSetUp} block />
        <Button
          label={alternativesShown >= MAX_ALTERNATIVES ? 'Browse the library' : 'Something else'}
          variant="secondary"
          onPress={handleSomethingElse}
          block
        />
        <Button
          label="Not now"
          onPress={() => {
            Alert.alert('Not now', "We'll offer this again in about a week.");
            router.back();
          }}
          variant="ghost"
          block
        />
      </View>
    </SafeAreaView>
  );
}

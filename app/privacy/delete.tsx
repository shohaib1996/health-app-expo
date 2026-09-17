import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, TextField } from '@/components/ui';
import { privacyApi } from '@/features/privacy/privacyApi';
import { formatLocalDateLong } from '@/lib/localDate';
import { useAppSelector } from '@/store/hooks';

const CONFIRM_WORD = 'DELETE';

/**
 * S-55 — type-to-confirm on the full delete. States the actual
 * server-side deletion deadline as a date and nothing more: the
 * backend's DELETE /privacy/data only schedules a DeletionRequest
 * today (deletion_sweep.py, the job that honours it, is not built
 * yet — docs/DECISIONS.md open item #1). This screen does not claim
 * the account is deleted immediately, and does not claim it "remains,
 * with nothing in it" — eraser.py, once the sweep runs, removes the
 * user row entirely.
 */
export default function DeleteDataScreen() {
  const isAnonymous = useAppSelector((s) => s.auth.isAnonymous);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);

  const canSubmit = confirmText.trim().toUpperCase() === CONFIRM_WORD && (isAnonymous || password.length > 0);

  const handleDelete = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const result = await privacyApi.requestDeletion({ password: isAnonymous ? null : password });
      setScheduledFor(result.scheduledFor);
    } catch {
      Alert.alert("Couldn't submit", 'Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (scheduledFor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-8">
        <Text className="text-center font-heading text-h4 text-text">Deletion scheduled.</Text>
        <Text className="mt-3 text-center font-body text-body-sm text-neutral-400">
          Your data will be deleted by {formatLocalDateLong(scheduledFor)}.
        </Text>
        <View className="mt-8 w-full">
          <Button label="Done" onPress={() => router.dismissTo('/(tabs)/settings')} block />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">Delete your data</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          This permanently deletes every night, note and experiment. It cannot be undone.
        </Text>

        {!isAnonymous && (
          <TextField
            label="Confirm your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="mt-6"
          />
        )}

        <TextField
          label={`Type ${CONFIRM_WORD} to confirm`}
          value={confirmText}
          onChangeText={setConfirmText}
          autoCapitalize="characters"
          className="mt-6"
        />
      </View>
      <View className="gap-2 pb-4">
        <Button
          label={submitting ? 'Submitting…' : 'Delete everything'}
          variant="secondary"
          onPress={handleDelete}
          disabled={submitting || !canSubmit}
          block
        />
        <Button label="Cancel" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

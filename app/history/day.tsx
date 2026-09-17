import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, Card } from '@/components/ui';
import { checkinsRepository } from '@/features/checkins/checkinsRepository';
import { useCheckInForDate } from '@/features/checkins/useCheckInForDate';
import { TAG_CATALOG } from '@/features/tags/tagCatalog';
import { formatLocalDateLong } from '@/lib/localDate';

const MOOD_LABELS = ['Very low', 'Low', 'Okay', 'Good', 'Very good'];

/** S-31 — everything from one day in one place, editable in place.
 * Delete requires confirmation. */
export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { checkIn, loading } = useCheckInForDate(date);
  const [deleting, setDeleting] = useState(false);

  const tagLabels = (checkIn?.tagKeys ?? []).map(
    (key) => TAG_CATALOG.find((t) => t.key === key)?.label ?? key,
  );

  const handleDelete = () => {
    if (!checkIn) return;
    Alert.alert('Delete this day?', 'This removes the check-in for this day. It cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await checkinsRepository.delete(checkIn.clientId);
            router.back();
          } catch {
            Alert.alert("Couldn't delete", 'Try again.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) return null;

  if (!checkIn) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">
          Nothing logged for {formatLocalDateLong(date)}.
        </Text>
        <View className="mt-6 w-full">
          <Button label="Close" variant="ghost" onPress={() => router.back()} block />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-heading text-h4 text-text">{formatLocalDateLong(checkIn.localDate)}</Text>
        {checkIn.source === 'backlog' && (
          <Text className="mt-1 font-body text-caption text-neutral-500">Filled in later</Text>
        )}

        <Card className="mt-6 gap-3">
          <Row label="Mood" value={MOOD_LABELS[checkIn.mood - 1]} />
          {checkIn.energy !== null && <Row label="Energy" value={MOOD_LABELS[checkIn.energy - 1]} />}
          {tagLabels.length > 0 && <Row label="Tags" value={tagLabels.join(', ')} />}
        </Card>

        {checkIn.note && (
          <View className="mt-4">
            <Text className="font-body text-caption text-neutral-500">Note</Text>
            <Text className="mt-1 font-body text-body-sm text-text">{checkIn.note}</Text>
          </View>
        )}

        {checkIn.voiceUri && (
          <Text className="mt-4 font-body text-caption text-neutral-500">
            Voice note recorded (playback not wired up yet)
          </Text>
        )}
      </View>

      <View className="gap-2 px-6 pb-4">
        <Button
          label="Edit"
          onPress={() => router.push({ pathname: '/checkin', params: { date: checkIn.localDate } })}
          block
        />
        <Button
          label={deleting ? 'Deleting…' : 'Delete'}
          variant="ghost"
          onPress={handleDelete}
          disabled={deleting}
          block
        />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-body text-caption text-neutral-500">{label}</Text>
      <Text className="font-body text-caption text-text">{value}</Text>
    </View>
  );
}

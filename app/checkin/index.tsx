import { useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, RatingPoint, TextField } from '@/components/ui';
import { checkinsRepository } from '@/features/checkins/checkinsRepository';
import { useTodayCheckIn } from '@/features/checkins/useTodayCheckIn';
import { useVoiceRecorder } from '@/features/checkins/useVoiceRecorder';
import { guardFreeText } from '@/features/safety/safetyGate';
import { TAG_CATALOG } from '@/features/tags/tagCatalog';

import { TagGrid } from './TagGrid';

const MAX_TAGS = 3;

/**
 * S-11 (mood/energy) + S-12 (tags) + S-13 (note/voice), one route with
 * an internal step — "Add more" is a card transition, not a
 * navigation push, so the 15-second path (mood, Save) never has to
 * mount a second screen.
 *
 * RatingPoint works in 0-4 index space (five glyph slots); mood/energy
 * on the wire and in SQLite are 1-5 (schemas.py: Field(ge=1, le=5)).
 * The +1/-1 conversion happens only at this boundary.
 */
export default function CheckInScreen() {
  const { save, saving } = useTodayCheckIn();
  const [step, setStep] = useState<'main' | 'tags' | 'note'>('main');
  const [moodIndex, setMoodIndex] = useState<number | null>(null);
  const [energyIndex, setEnergyIndex] = useState<number | null>(null);
  const [tagKeys, setTagKeys] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const recorder = useVoiceRecorder();

  const canSave = moodIndex !== null;

  const toggleTag = (key: string) => {
    setTagKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_TAGS) return prev;
      return [...prev, key];
    });
  };

  const handleSave = async () => {
    if (moodIndex === null) return;
    // S-13: the highest-risk input surface. Trip = redirect
    // immediately, don't save, don't proceed (spec's hard rule).
    if (guardFreeText(note)) return;
    try {
      await save({
        mood: moodIndex + 1,
        energy: energyIndex !== null ? energyIndex + 1 : null,
        tagKeys,
        note: note.trim() || null,
        voiceUri: recorder.uri,
      });
      const nightsLogged = await checkinsRepository.countLoggedNights();
      router.replace({ pathname: '/checkin/saved', params: { nightsLogged: String(nightsLogged) } });
    } catch {
      Alert.alert("Couldn't save", 'That check-in was not saved. Try again.');
    }
  };

  const tagCountLabel = useMemo(() => `${tagKeys.length} of ${MAX_TAGS}`, [tagKeys.length]);

  if (step === 'note') {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 py-6">
          <TextField
            label="Anything worth remembering about today?"
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="Type, or hold the button below to record"
          />

          {recorder.hasPermission !== false && (
            <View className="mt-6 items-center">
              <Button
                label={
                  recorder.isRecording
                    ? `Recording… ${recorder.remainingSeconds}s left, tap to stop`
                    : recorder.uri
                      ? 'Recording saved — tap to re-record'
                      : 'Hold to record'
                }
                variant="secondary"
                onPress={() => {
                  if (recorder.isRecording) void recorder.stop();
                  else void recorder.start();
                }}
              />
            </View>
          )}
        </View>
        <View className="gap-2 px-6 pb-4">
          <Button label={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving || !canSave} block />
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'tags') {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 py-6">
          <Text className="font-heading text-h4 text-text">Anything else tonight?</Text>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="font-body text-caption text-neutral-500">Pick up to 3</Text>
            <Text className="font-body text-caption tabular-nums text-neutral-500">{tagCountLabel}</Text>
          </View>
          <TagGrid
            tags={TAG_CATALOG}
            selected={tagKeys}
            onToggle={toggleTag}
            maxReached={tagKeys.length >= MAX_TAGS}
          />
        </View>
        <View className="gap-2 px-6 pb-4">
          <Button label={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving || !canSave} block />
          <Button label="Add note" variant="ghost" onPress={() => setStep('note')} block />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-heading text-h4 text-text">How was today?</Text>
        <View className="mt-4 flex-row gap-2">
          {([0, 1, 2, 3, 4] as const).map((i) => (
            <RatingPoint
              key={i}
              index={i}
              selected={moodIndex === i}
              onPress={() => setMoodIndex(i)}
              accessibilityLabel={`Mood ${i + 1} of 5`}
            />
          ))}
        </View>
        <View className="mt-1 flex-row justify-between">
          <Text className="font-body text-caption text-neutral-500">Low</Text>
          <Text className="font-body text-caption text-neutral-500">High</Text>
        </View>

        <Text className="mt-8 font-heading text-h5 text-text">Energy</Text>
        <Text className="font-body text-caption text-neutral-500">Optional</Text>
        <View className="mt-3 flex-row gap-2">
          {([0, 1, 2, 3, 4] as const).map((i) => (
            <RatingPoint
              key={i}
              index={i}
              selected={energyIndex === i}
              onPress={() => setEnergyIndex(energyIndex === i ? null : i)}
              accessibilityLabel={`Energy ${i + 1} of 5`}
            />
          ))}
        </View>
      </View>

      <View className="gap-2 px-6 pb-4">
        <Button label={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving || !canSave} block />
        <Button label="Add more" variant="ghost" onPress={() => setStep('tags')} block />
      </View>
    </SafeAreaView>
  );
}

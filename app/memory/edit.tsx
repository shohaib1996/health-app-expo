import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, TextField } from '@/components/ui';
import { memoryApi } from '@/features/memory/memoryApi';
import { useMemory } from '@/features/memory/useMemory';

/** S-41 — text edit or delete, with a plain statement of where the
 * entry came from before deletion (derived entries cascade
 * server-side, §5.6). */
export default function EditMemoryEntryScreen() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const { entries, loading } = useMemory();
  const entry = entries.find((e) => e.id === entryId);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (entry) setText(entry.text);
  }, [entry]);

  const handleSave = async () => {
    if (!entryId || !text.trim()) return;
    setSaving(true);
    try {
      await memoryApi.update(entryId, { text: text.trim() });
      router.back();
    } catch {
      Alert.alert("Couldn't save", 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!entryId) return;
    Alert.alert('Forget this?', 'Anything derived from this entry is removed too.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Forget',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await memoryApi.remove(entryId);
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

  if (!entry) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center font-body text-body-sm text-neutral-400">Entry not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <TextField label="Entry" value={text} onChangeText={setText} multiline />
        {entry.sourceType && (
          <Text className="mt-3 font-body text-caption text-neutral-500">Source: {entry.sourceType}</Text>
        )}
      </View>
      <View className="gap-2 pb-4">
        <Button
          label={saving ? 'Saving…' : 'Save'}
          onPress={handleSave}
          disabled={saving || !text.trim()}
          block
        />
        <Button
          label={deleting ? 'Forgetting…' : 'Forget this'}
          variant="ghost"
          onPress={handleDelete}
          disabled={deleting}
          block
        />
      </View>
    </SafeAreaView>
  );
}

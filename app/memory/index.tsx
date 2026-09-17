import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui';
import { useMemory } from '@/features/memory/useMemory';
import type { MemoryCategory, MemoryEntry } from '@/features/memory/memoryTypes';

const GROUPS: Array<{ category: MemoryCategory; title: string }> = [
  { category: 'told_you', title: 'What you told me' },
  { category: 'seen', title: "What I've seen" },
  { category: 'worked', title: "What's worked" },
  { category: 'didnt_work', title: "What didn't" },
];

/**
 * S-40 — the app's memory, fully visible and fully editable. Entries
 * are structured records, not a chat summary; every one links back to
 * where it came from. Empty today is expected and honest: nothing
 * calls MemoryService.record() yet on the backend, so this list fills
 * in as later sections wire it up, not as a bug in this screen.
 */
export default function MemoryScreen() {
  const { byCategory, loading, error, entries } = useMemory();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">What the app knows about you</Text>

        {loading && <Text className="mt-6 font-body text-body-sm text-neutral-400">Loading…</Text>}
        {!loading && error && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">Couldn't load this right now.</Text>
        )}
        {!loading && !error && entries.length === 0 && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            Nothing yet — check in for a few days.
          </Text>
        )}

        {!loading &&
          !error &&
          GROUPS.map((group) => {
            const items = byCategory(group.category);
            if (items.length === 0) return null;
            return (
              <View key={group.category} className="mt-6">
                <Text className="font-heading text-h6 text-neutral-400">{group.title}</Text>
                <View className="mt-2">
                  {items.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} />
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

function EntryRow({ entry }: { entry: MemoryEntry }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/memory/edit', params: { entryId: entry.id } })}
      className="flex-row items-center justify-between border-b border-neutral-800 py-3"
    >
      <Text className="flex-1 pr-3 font-body text-body-sm text-text">{entry.text}</Text>
      <Text className="font-body text-caption text-neutral-500">edit</Text>
    </Pressable>
  );
}

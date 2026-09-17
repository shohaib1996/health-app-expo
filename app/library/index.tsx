import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, Card } from '@/components/ui';
import { useProtocolLibrary } from '@/features/protocols/useProtocolLibrary';

/**
 * S-27 Library browse — the ~30 curated protocols by domain. No
 * accent anywhere: these are generic templates, not the app's own
 * findings, so none of them have earned the reward colour yet (same
 * rule as the mockup annotation). Blocked-while-active handling lands
 * once the active-experiment check is wired at the call site (S-20).
 */
export default function LibraryScreen() {
  const { groups, loading, error } = useProtocolLibrary();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">Experiment library</Text>

        {loading && <Text className="mt-6 font-body text-body-sm text-neutral-400">Loading…</Text>}

        {!loading && error && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            Couldn't load the library. Check your connection and try again.
          </Text>
        )}

        {!loading && !error && groups.length === 0 && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">No protocols available yet.</Text>
        )}

        {!loading &&
          !error &&
          groups.map((group) => (
            <View key={group.domain} className="mt-6">
              <Text className="font-heading text-h5 text-text">{group.domain}</Text>
              <View className="mt-3 gap-2">
                {group.protocols.map((protocol) => (
                  <Card key={protocol.key}>
                    <Text className="font-heading text-body text-text">{protocol.name}</Text>
                    <Text className="mt-1 font-body text-caption text-neutral-500">
                      {protocol.durationDays} days · {protocol.evidenceNote}
                    </Text>
                  </Card>
                ))}
              </View>
            </View>
          ))}
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

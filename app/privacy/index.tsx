import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, Card, ListRow } from '@/components/ui';

interface DataRow {
  type: string;
  why: string;
  where: string;
}

const DATA_ROWS: DataRow[] = [
  {
    type: 'Check-ins (mood, energy, tags, notes, voice)',
    why: 'The core input the engine looks for patterns in.',
    where: 'On this device. Synced to the server so it survives a lost phone.',
  },
  {
    type: 'Sleep and activity data',
    why: 'To see whether last night explains today.',
    where: 'On this device, if you connect it. Not yet wired up in this build.',
  },
  {
    type: 'Experiments and verdicts',
    why: 'The two-week tests you run and their honest results.',
    where: 'On the server, so the verdict date and history survive a reinstall.',
  },
  {
    type: 'Account identity',
    why: 'To match your data across devices if you sign in.',
    where: 'On the server. Anonymous by default — see Account in Settings.',
  },
];

/** S-53 — every data type, why it is collected, where it lives, in
 * plain language. No table of third parties to decode. */
export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">Privacy and data</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          What is collected, why, and where it lives. Your check-in data is never sold.
        </Text>

        <View className="mt-6 gap-2">
          {DATA_ROWS.map((row) => (
            <Card key={row.type}>
              <Text className="font-heading text-body text-text">{row.type}</Text>
              <Text className="mt-1 font-body text-caption text-neutral-400">{row.why}</Text>
              <Text className="mt-1 font-body text-caption text-neutral-500">{row.where}</Text>
            </Card>
          ))}
        </View>

        <View className="mt-8">
          <ListRow label="Export your data" onPress={() => router.push('/privacy/export')} />
          <ListRow label="Delete your data" onPress={() => router.push('/privacy/delete')} />
        </View>
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** S-30 History — the user's own record, month calendar + summary
 * strip. Placeholder until check-in data is read back from SQLite. */
export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-body text-caption text-neutral-500">History</Text>
        <Text className="mt-1 font-heading text-h3 text-text">Nothing logged yet</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          Tonight's check-in starts this calendar.
        </Text>
      </View>
    </SafeAreaView>
  );
}

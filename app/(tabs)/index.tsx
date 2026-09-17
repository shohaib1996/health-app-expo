import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** S-10 Today — home tab. Placeholder until the six primary-slot states
 * (checkin due / verdict due / new experiment / cold-start action /
 * running experiment / quiet) are wired to real local + synced data. */
export default function TodayScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-body text-caption text-neutral-500">Today</Text>
        <Text className="mt-1 font-heading text-h3 text-text">Nothing needs attention yet</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          Check-in and pattern cards land here next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

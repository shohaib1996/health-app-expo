import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** S-50 Settings home — section list (health, reminders, privacy,
 * export, subscription, account, help, about). Placeholder rows. */
export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-heading text-h3 text-text">Settings</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          Health connections, reminders, privacy and account settings land here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ListRow } from '@/components/ui';

/** S-50 Settings home. Only 'Help and resources' (S-58) is wired so
 * far — the rest are real rows, dimmed, not hidden, so the section
 * list stays honest about what's built. */
export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h3 text-text">Settings</Text>

        <View className="mt-6">
          <ListRow label="Health connections" onPress={() => router.push('/health')} />
          <ListRow label="Reminders" onPress={() => router.push('/reminders')} />
          <ListRow label="Privacy" onPress={() => router.push('/privacy')} />
          <ListRow label="Export data" onPress={() => router.push('/privacy/export')} />
          <ListRow label="Subscription" disabled />
          <ListRow label="Account" onPress={() => router.push('/account')} />
          <ListRow label="Help and resources" onPress={() => router.push('/safety/resources')} />
          <ListRow label="About" onPress={() => router.push('/about')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

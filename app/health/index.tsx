import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, ListRow } from '@/components/ui';

/**
 * S-51 — per-metric status. Health Connect/HealthKit integration
 * isn't wired up yet, so every row honestly reads 'Not connected'
 * rather than faking a permission state. The spec's iOS caveat (read
 * permission can't be inspected, so never render 'permission denied')
 * applies just as much to 'not built yet' — say what's true, not what
 * would be reassuring.
 */
export default function HealthConnectionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">Health connections</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          Sleep and activity data are not connected yet — this is not wired up to Health Connect or
          the Health app in this build. Everything works fine entered by hand in the meantime.
        </Text>

        <View className="mt-6">
          <ListRow label="Sleep" value="Not connected" />
          <ListRow label="Steps and workouts" value="Not connected" />
          <ListRow label="Resting heart rate" value="Not connected" />
          <ListRow label="Heart rate variability" value="Not connected" />
        </View>
      </View>
      <View className="pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

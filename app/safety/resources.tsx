import { Linking, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, Card } from '@/components/ui';
import { useSafetyResources } from '@/features/safety/useSafetyResources';

/**
 * S-58 — always reachable, never gated on auth or entitlement (G-6,
 * §5.10). Plain, calm copy; no product chrome fighting for attention.
 * No hardcoded numbers on-device — see useSafetyResources.ts.
 */
export default function SafetyResourcesScreen() {
  const { data, loading, error, refresh } = useSafetyResources();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h4 text-text">Support resources</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          If you're in crisis or thinking about harming yourself, reach out to someone now.
        </Text>

        {loading && <Text className="mt-6 font-body text-body-sm text-neutral-400">Loading…</Text>}

        {!loading && error && (
          <View className="mt-6 gap-3">
            <Text className="font-body text-body-sm text-neutral-400">
              Couldn't load resources for your region. If this is an emergency, contact your local emergency
              number directly.
            </Text>
            <Button label="Try again" variant="secondary" onPress={() => void refresh()} />
          </View>
        )}

        {!loading && !error && data && (
          <View className="mt-6 gap-2">
            {data.resources.map((resource) => (
              <Card key={resource.name}>
                <Text className="font-heading text-body text-text">{resource.name}</Text>
                {resource.description && (
                  <Text className="mt-1 font-body text-caption text-neutral-400">{resource.description}</Text>
                )}
                <View className="mt-3 flex-row flex-wrap gap-4">
                  {resource.phone && (
                    <Text
                      className="font-body text-body-sm text-text"
                      onPress={() => Linking.openURL(`tel:${resource.phone}`)}
                    >
                      Call {resource.phone}
                    </Text>
                  )}
                  {resource.sms && (
                    <Text
                      className="font-body text-body-sm text-text"
                      onPress={() => Linking.openURL(`sms:${resource.sms}`)}
                    >
                      Text {resource.sms}
                    </Text>
                  )}
                  {resource.url && (
                    <Text
                      className="font-body text-body-sm text-text"
                      onPress={() => Linking.openURL(resource.url!)}
                    >
                      Open website
                    </Text>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
      <View className="px-6 pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

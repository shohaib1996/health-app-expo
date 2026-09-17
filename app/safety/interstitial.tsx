import { Linking, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useSafetyResources } from '@/features/safety/useSafetyResources';

/**
 * S-60 — blocking, not dismissible by any gesture. Deliberately not
 * this app's visual language: no tabular numerals, no hero slot, no
 * confidence tokens, no accent, no card border, plainer than anything
 * else in the product, because this is the one moment it should feel
 * like it's getting out of the way. Fixed copy, never generated.
 * No LLM call on any branch of this screen.
 */
export default function SupportInterstitialScreen() {
  const { data, loading } = useSafetyResources();

  return (
    <SafeAreaView className="flex-1 bg-bg px-8">
      <View className="flex-1 items-center justify-center gap-6">
        <Text className="text-center font-body text-h4 leading-relaxed text-text">
          It sounds like you're going through something hard right now.
        </Text>
        <Text className="text-center font-body text-body leading-relaxed text-neutral-300">
          You don't have to go through this alone. Reaching out to someone now can help.
        </Text>

        {!loading && data && data.resources.length > 0 && (
          <View className="mt-4 w-full gap-4">
            {data.resources.slice(0, 2).map((resource) => (
              <View key={resource.name}>
                <Text className="text-center font-body text-body text-neutral-400">{resource.name}</Text>
                {resource.phone && (
                  <Text
                    className="mt-1 text-center font-body text-body text-text"
                    onPress={() => Linking.openURL(`tel:${resource.phone}`)}
                  >
                    Call {resource.phone}
                  </Text>
                )}
                {resource.sms && (
                  <Text
                    className="mt-1 text-center font-body text-body text-text"
                    onPress={() => Linking.openURL(`sms:${resource.sms}`)}
                  >
                    Text {resource.sms}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="pb-8">
        <Text
          className="text-center font-body text-body-sm text-neutral-500"
          onPress={() => router.dismissAll()}
        >
          Continue to the app
        </Text>
      </View>
    </SafeAreaView>
  );
}

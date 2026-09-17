import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, Card } from '@/components/ui';

const FREE_FEATURES = [
  'Daily check-in',
  'All your history',
  'Export everything',
  '3 live patterns',
  '1 experiment a month',
  'Support resources',
];

const PRO_FEATURES = [
  'Unlimited patterns',
  'A new experiment weekly',
  'Deeper correlations',
  'Voice check-in',
  'The sleep programme',
];

/**
 * S-80 — appears only after the first verdict in the real flow (not
 * yet wired to that trigger point) or via the permanent Settings
 * entry, matching the spec exactly. Exact price, exact renewal date,
 * cancellation path, all in normal-size type, right here. No
 * countdown, no fake discount. 'Keep using the free version' is
 * exactly as legible as the paid option — no purchase SDK is wired up
 * yet (RevenueCat/store billing needs a store account this build
 * doesn't have), so 'Start trial' says that honestly instead of
 * pretending to charge anyone.
 */
export default function PaywallScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <Text className="font-heading text-h3 text-text">Free, always</Text>
        <Card className="mt-3 gap-1.5">
          {FREE_FEATURES.map((f) => (
            <Text key={f} className="font-body text-body-sm text-neutral-300">
              {f}
            </Text>
          ))}
        </Card>

        <Text className="mt-6 font-heading text-h3 text-text">Pro</Text>
        <Card className="mt-3 gap-1.5">
          {PRO_FEATURES.map((f) => (
            <Text key={f} className="font-body text-body-sm text-neutral-300">
              {f}
            </Text>
          ))}
        </Card>

        <Text className="mt-6 font-body text-body-sm text-neutral-400">
          21 days free, then $39.99 a year. That's $3.33 a month. Cancel any time in your app store's
          subscription settings.
        </Text>
      </ScrollView>
      <View className="gap-2 px-6 pb-4">
        <Button
          label="Start 21-day trial"
          onPress={() =>
            Alert.alert(
              'Not wired up yet',
              'In-app purchases need a store billing integration this build does not have.',
            )
          }
          block
        />
        <Button label="Keep using the free version" variant="secondary" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

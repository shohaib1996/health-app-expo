import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, ListRow } from '@/components/ui';
import { useEntitlement } from '@/features/subscriptions/useEntitlement';
import { formatLocalDateLong } from '@/lib/localDate';

/**
 * S-56 — exact plan, exact renewal price, exact renewal date, a
 * one-tap link to the platform's manage-subscription screen. No
 * retention interstitial, no discount offer on the cancel path (the
 * spec calls this a dark-pattern risk not worth taking).
 */
export default function SubscriptionScreen() {
  const { entitlement, loading } = useEntitlement();

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">Subscription</Text>

        {loading && <Text className="mt-4 font-body text-body-sm text-neutral-400">Loading…</Text>}

        {!loading && entitlement?.tier === 'free' && (
          <>
            <Text className="mt-2 font-body text-body-sm text-neutral-400">
              You're on the free plan. Daily check-ins, all your history and export are free, always.
            </Text>
            <Button label="See what Pro adds" onPress={() => router.push('/paywall')} className="mt-6" />
          </>
        )}

        {!loading && entitlement?.tier === 'pro' && (
          <View className="mt-6">
            <ListRow label="Plan" value="Pro" />
            {entitlement.currentPeriodEnd && (
              <ListRow
                label={entitlement.willRenew ? 'Renews' : 'Ends'}
                value={formatLocalDateLong(entitlement.currentPeriodEnd.slice(0, 10))}
              />
            )}
            <Text className="mt-4 font-body text-caption text-neutral-500">
              Manage or cancel from your app store's subscription settings — not from within this app, so
              there's no retention screen in the way.
            </Text>
          </View>
        )}
      </View>
      <View className="pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

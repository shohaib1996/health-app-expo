import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui';
import { useTodayCheckIn } from '@/features/checkins/useTodayCheckIn';
import { useActiveExperiment } from '@/features/experiments/useActiveExperiment';

/** S-10 Today — home tab. Only state 1 (check-in not done) and state 6
 * (quiet, done) are wired so far; verdict-due / new-experiment /
 * cold-start-action wait on the pattern engine (Decisions doc §6).
 * State 5 (experiment running) is approximated with a plain link
 * rather than the dated strip until that engine exists. */
export default function TodayScreen() {
  const { checkIn, loading } = useTodayCheckIn();
  const { hasActive } = useActiveExperiment();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-body text-caption text-neutral-500">Today</Text>

        {loading ? null : checkIn ? (
          <>
            <Text className="mt-1 font-heading text-h3 text-text">Nothing needs attention today</Text>
            <Text className="mt-2 font-body text-body-sm text-neutral-400">Check-in logged.</Text>
            {/* No experiment/proposal flow wired yet (S-20 needs the
                pattern engine, which isn't built — Decisions doc §6).
                This is a temporary way in to S-27 until that lands. */}
            {hasActive ? (
              <Button
                label="View active experiment"
                variant="ghost"
                onPress={() => router.push('/experiment/active')}
                className="mt-6 self-start px-0"
              />
            ) : (
              <Button
                label="Browse experiment library"
                variant="ghost"
                onPress={() => router.push('/library')}
                className="mt-6 self-start px-0"
              />
            )}
          </>
        ) : (
          <>
            <Text className="mt-1 font-heading text-h3 text-text">Check in</Text>
            <Button
              label="Check in"
              onPress={() => router.push('/checkin')}
              block
              className="mt-6"
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

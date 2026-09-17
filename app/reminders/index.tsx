import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, TextField } from '@/components/ui';
import { setEventNotificationsEnabled, setReminderTime } from '@/features/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

/**
 * S-52 — publishing the cap is a trust signal per the spec: 'At most
 * one reminder a day, plus up to three experiment notifications a
 * week.' The value here is real, persisted user intent; actually
 * scheduling a local notification at this time needs
 * expo-notifications, which is not installed yet, so nothing fires —
 * this screen sets the preference the feature will read once it does.
 */
export default function RemindersScreen() {
  const dispatch = useAppDispatch();
  const reminderTime = useAppSelector((s) => s.settings.reminderTime);
  const eventNotificationsEnabled = useAppSelector((s) => s.settings.eventNotificationsEnabled);

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">Reminders</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          At most one reminder a day, plus up to three experiment notifications a week. Nothing else, ever.
        </Text>

        <TextField
          label="Check-in time"
          value={reminderTime ?? ''}
          onChangeText={(v) => dispatch(setReminderTime(v))}
          placeholder="21:30"
          className="mt-6"
        />
        <Text className="mt-1 font-body text-caption text-neutral-500">
          Scheduling isn't wired up yet — this saves your preferred time for when it is.
        </Text>

        <Pressable
          onPress={() => dispatch(setEventNotificationsEnabled(!eventNotificationsEnabled))}
          className="mt-6 flex-row items-center justify-between border-t border-neutral-800 py-3.5"
        >
          <Text className="font-body text-body-sm text-text">Experiment notifications</Text>
          <Text className="font-body text-caption text-neutral-500">
            {eventNotificationsEnabled ? 'On' : 'Off'}
          </Text>
        </Pressable>
      </View>
      <View className="pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

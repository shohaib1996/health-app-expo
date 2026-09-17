import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui';
import { BACKLOG_WINDOW_DAYS } from '@/features/checkins/checkinsRules';
import { moodNeutralStep } from '@/features/checkins/moodColor';
import { useMonthHistory } from '@/features/checkins/useMonthHistory';
import { addDaysToLocalDate, todayLocalDate } from '@/lib/localDate';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DOT_CLASS: Record<300 | 500 | 700, string> = {
  300: 'bg-neutral-300',
  500: 'bg-neutral-500',
  700: 'bg-neutral-700',
};

/** S-30 History home — month calendar with a mood dot per logged day,
 * plus a summary strip. History is never paywalled, never depth- or
 * range-limited (G-6 / §5.12). Sleep data waits on health_data/sync;
 * "Avg sleep" is a placeholder dash until that module lands. */
export default function HistoryScreen() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth());
  const { cells, nightsLogged, run, loading } = useMonthHistory(year, month);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 px-6 py-6">
        <Text className="font-heading text-h4 text-text">
          {MONTH_NAMES[month]} {year}
        </Text>

        <View className="mt-6 flex-row justify-between">
          <SummaryStat label="Nights logged" value={String(nightsLogged)} />
          <SummaryStat label="Current run" value={String(run)} />
          <SummaryStat label="Avg sleep" value="—" />
        </View>

        <View className="mt-6 flex-row">
          {WEEKDAYS.map((w, i) => (
            <Text key={i} className="flex-1 text-center font-body text-caption text-neutral-500">
              {w}
            </Text>
          ))}
        </View>

        {!loading && (
          <View className="mt-2 flex-row flex-wrap">
            {cells.map((cell, i) => {
              const today = todayLocalDate();
              const backlogCutoff = addDaysToLocalDate(today, -BACKLOG_WINDOW_DAYS);
              const canBacklog = cell.date !== null && cell.date <= today && cell.date >= backlogCutoff;
              const onPress =
                cell.date === null
                  ? undefined
                  : cell.mood !== null
                    ? () => router.push({ pathname: '/history/day', params: { date: cell.date! } })
                    : canBacklog
                      ? () => router.push({ pathname: '/checkin', params: { date: cell.date! } })
                      : undefined;

              return (
                <Pressable
                  key={cell.date ?? `blank-${i}`}
                  disabled={!onPress}
                  onPress={onPress}
                  className="aspect-square w-[14.28%] items-center justify-center"
                >
                  {cell.day !== null && (
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-default ${cell.isToday ? 'border border-neutral-600' : ''}`}
                    >
                      <Text
                        className={`font-body text-caption ${cell.isToday ? 'text-text' : 'text-neutral-500'}`}
                      >
                        {cell.day}
                      </Text>
                      {cell.mood !== null ? (
                        <View
                          className={`mt-0.5 h-1.5 w-1.5 rounded-full ${DOT_CLASS[moodNeutralStep(cell.mood)]}`}
                        />
                      ) : (
                        canBacklog && (
                          <Text className="mt-0.5 font-body text-caption text-neutral-600">+</Text>
                        )
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {!loading && nightsLogged === 0 && (
          <Text className="mt-6 font-body text-body-sm text-neutral-400">
            Nothing logged yet. Tonight's check-in starts this calendar.
          </Text>
        )}

        <Button
          label="Past experiments"
          variant="ghost"
          onPress={() => router.push('/history/experiments')}
          className="mt-6 self-start px-0"
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="font-heading text-h3 tabular-nums text-text">{value}</Text>
      <Text className="mt-1 font-body text-caption text-neutral-500">{label}</Text>
    </View>
  );
}

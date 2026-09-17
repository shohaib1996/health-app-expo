import { todayLocalDate } from '@/lib/localDate';

import { useCheckInForDate } from './useCheckInForDate';

/** `useCheckInForDate` pinned to today — see that hook for the shared
 * implementation backing both S-11 and S-32. */
export function useTodayCheckIn() {
  return useCheckInForDate(todayLocalDate());
}

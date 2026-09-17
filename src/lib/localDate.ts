/**
 * "Local date" here means the device's calendar day, not UTC — a
 * check-in at 11:58pm and one at 12:02am the next morning are
 * different days even though they're 4 minutes apart in UTC terms.
 * Every date the app stores or compares (local_date, backlog window)
 * goes through this, never `new Date().toISOString().slice(0, 10)`.
 */
export function todayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Adds `days` (may be negative) to a 'YYYY-MM-DD' local-date string,
 * returning the same format. Used for verdict-date previews — never
 * raw millisecond math on a Date directly. */
export function addDaysToLocalDate(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const next = new Date(year, month - 1, day + days);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

/** Formats 'YYYY-MM-DD' as e.g. "Sunday 28 September" for display. */
export function formatLocalDateLong(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

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

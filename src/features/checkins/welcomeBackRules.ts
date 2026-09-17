/** Pure gap classification for S-70 (short gap, 3-13 days) / S-71
 * (long gap, 14+ days). Under 3 days is not a gap worth commenting on
 * at all — the spec's short-gap copy barely mentions it, and the app
 * should say nothing rather than manufacture a moment. */

export type GapKind = 'none' | 'short' | 'long';

export function classifyGap(daysSinceLastCheckIn: number | null): GapKind {
  if (daysSinceLastCheckIn === null || daysSinceLastCheckIn < 3) return 'none';
  if (daysSinceLastCheckIn < 14) return 'short';
  return 'long';
}

export function daysBetween(lastDate: string, today: string): number {
  const [ly, lm, ld] = lastDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const last = Date.UTC(ly, lm - 1, ld);
  const now = Date.UTC(ty, tm - 1, td);
  return Math.round((now - last) / 86_400_000);
}

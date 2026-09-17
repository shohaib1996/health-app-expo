/** Pure content rule for S-14 (check-in saved). "New pattern found" is
 * the top-priority variant in the spec but needs the on-device pattern
 * engine, which isn't built yet (Decisions doc §6 — the TS engine is
 * still the Phase-1 gate). Until then this covers the other two:
 * milestone and ordinary. Never a bare "Saved." (spec: "even [the
 * ordinary case] gives information"). */

const PATTERN_THRESHOLD_NIGHTS = 21; // PRD: ~21 nights minimum before the engine has anything to test.
const MILESTONES = [7, 14, 21, 30, 60, 90, 180, 365];

export type SavedVariant =
  { kind: 'milestone'; nights: number; message: string } | { kind: 'ordinary'; message: string };

export function pickSavedVariant(nightsLogged: number): SavedVariant {
  if (MILESTONES.includes(nightsLogged)) {
    const message =
      nightsLogged === PATTERN_THRESHOLD_NIGHTS
        ? `That's ${nightsLogged} nights. Enough to start looking for patterns.`
        : `That's ${nightsLogged} nights logged.`;
    return { kind: 'milestone', nights: nightsLogged, message };
  }

  if (nightsLogged < PATTERN_THRESHOLD_NIGHTS) {
    const remaining = PATTERN_THRESHOLD_NIGHTS - nightsLogged;
    return {
      kind: 'ordinary',
      message: `Logged. ${remaining} more night${remaining === 1 ? '' : 's'} before patterns are testable.`,
    };
  }

  return { kind: 'ordinary', message: 'Logged.' };
}

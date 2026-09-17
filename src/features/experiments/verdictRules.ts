import type { ConfidenceRole } from '@/components/ui/ConfidenceDot';

import type { VerdictResponse, VerdictType } from './experimentsTypes';

/** Pure display mapping for S-24, isolated so it's unit-testable
 * without a network call. The backend already applies the
 * hero-renders-0-when-CI-crosses-zero rule (verdict_service.py) —
 * this only formats what the server already decided, never
 * recomputes a statistic client-side. */

const ROLE_BY_VERDICT: Record<VerdictType, ConfidenceRole> = {
  worked: 'supported',
  didnt_work: 'noEffect',
  inconclusive: 'insufficientData',
};

const HEADLINE_BY_VERDICT: Record<VerdictType, string> = {
  worked: 'It worked.',
  didnt_work: "It didn't.",
  inconclusive: 'Inconclusive.',
};

export interface VerdictDisplay {
  role: ConfidenceRole;
  headline: string;
  heroValue: string;
  heroUnit: string;
  likelyRange: string;
}

function formatDelta(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? '+' : '';
  const display = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${sign}${display}`;
}

export function toVerdictDisplay(verdict: VerdictResponse): VerdictDisplay {
  const role = ROLE_BY_VERDICT[verdict.verdictType];
  const headline = HEADLINE_BY_VERDICT[verdict.verdictType];

  if (verdict.verdictType === 'inconclusive' || verdict.heroDelta === null) {
    return {
      role,
      headline,
      heroValue: `${verdict.keptDays} of ${verdict.durationDays}`,
      heroUnit: 'nights kept',
      likelyRange: 'Too few nights for a range',
    };
  }

  const likelyRange =
    verdict.likelyRangeLow !== null && verdict.likelyRangeHigh !== null
      ? `Likely range: ${formatDelta(verdict.likelyRangeLow)} to ${formatDelta(verdict.likelyRangeHigh)}`
      : '';

  return {
    role,
    headline,
    heroValue: formatDelta(verdict.heroDelta),
    heroUnit: verdict.heroUnit ?? '',
    likelyRange,
  };
}

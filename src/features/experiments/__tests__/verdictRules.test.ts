import { toVerdictDisplay } from '../verdictRules';
import type { VerdictResponse } from '../experimentsTypes';

const BASE: VerdictResponse = {
  id: '1',
  protocolKey: 'phone-outside-bedroom',
  protocolName: 'Phone outside the bedroom',
  durationDays: 14,
  keptDays: 12,
  verdictType: 'worked',
  heroDelta: 38,
  heroUnit: 'minutes of sleep',
  likelyRangeLow: 21,
  likelyRangeHigh: 54,
  beforeAverage: 372,
  duringAverage: 410,
  secondaryMetric: 'mood',
  secondaryChanged: false,
  secondaryBeforeAverage: 3,
  secondaryDuringAverage: 3,
  reason: null,
};

describe('toVerdictDisplay', () => {
  it('formats a positive worked delta with a + sign and role=supported', () => {
    const display = toVerdictDisplay(BASE);
    expect(display).toMatchObject({
      role: 'supported',
      headline: 'It worked.',
      heroValue: '+38',
      heroUnit: 'minutes of sleep',
      likelyRange: 'Likely range: +21 to +54',
    });
  });

  it('renders a zeroed hero (CI crosses zero) with role=noEffect, no sign', () => {
    const display = toVerdictDisplay({
      ...BASE,
      verdictType: 'didnt_work',
      heroDelta: 0,
      likelyRangeLow: -9,
      likelyRangeHigh: 8,
    });
    expect(display.role).toBe('noEffect');
    expect(display.heroValue).toBe('0');
    expect(display.likelyRange).toBe('Likely range: -9 to +8');
  });

  it('shows kept/duration instead of a delta when inconclusive', () => {
    const display = toVerdictDisplay({
      ...BASE,
      verdictType: 'inconclusive',
      keptDays: 6,
      heroDelta: null,
      likelyRangeLow: null,
      likelyRangeHigh: null,
    });
    expect(display).toMatchObject({
      role: 'insufficientData',
      headline: 'Inconclusive.',
      heroValue: '6 of 14',
      heroUnit: 'nights kept',
      likelyRange: 'Too few nights for a range',
    });
  });

  it('rounds to one decimal place and drops a trailing .0', () => {
    const display = toVerdictDisplay({ ...BASE, heroDelta: 1.44, likelyRangeLow: 0.8, likelyRangeHigh: 2.0 });
    expect(display.heroValue).toBe('+1.4');
    expect(display.likelyRange).toBe('Likely range: +0.8 to +2');
  });
});

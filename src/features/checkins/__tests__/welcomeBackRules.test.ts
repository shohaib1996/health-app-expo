import { classifyGap, daysBetween } from '../welcomeBackRules';

describe('daysBetween', () => {
  it('is zero for the same date', () => {
    expect(daysBetween('2026-09-14', '2026-09-14')).toBe(0);
  });

  it('counts across a month boundary', () => {
    expect(daysBetween('2026-08-30', '2026-09-05')).toBe(6);
  });
});

describe('classifyGap', () => {
  it('is none for null (nothing ever logged)', () => {
    expect(classifyGap(null)).toBe('none');
  });

  it('is none under 3 days', () => {
    expect(classifyGap(0)).toBe('none');
    expect(classifyGap(2)).toBe('none');
  });

  it('is short from 3 up to 13 days', () => {
    expect(classifyGap(3)).toBe('short');
    expect(classifyGap(13)).toBe('short');
  });

  it('is long at 14+ days', () => {
    expect(classifyGap(14)).toBe('long');
    expect(classifyGap(90)).toBe('long');
  });
});

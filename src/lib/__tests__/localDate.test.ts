import { addDaysToLocalDate, formatLocalDateLong } from '../localDate';

describe('addDaysToLocalDate', () => {
  it('adds days within a month', () => {
    expect(addDaysToLocalDate('2026-09-01', 14)).toBe('2026-09-15');
  });

  it('rolls over a month boundary', () => {
    expect(addDaysToLocalDate('2026-09-20', 14)).toBe('2026-10-04');
  });

  it('rolls over a year boundary', () => {
    expect(addDaysToLocalDate('2026-12-25', 14)).toBe('2027-01-08');
  });

  it('supports negative days', () => {
    expect(addDaysToLocalDate('2026-09-15', -14)).toBe('2026-09-01');
  });
});

describe('formatLocalDateLong', () => {
  it('formats as weekday, day, month', () => {
    expect(formatLocalDateLong('2026-09-28')).toBe('Monday, September 28');
  });
});

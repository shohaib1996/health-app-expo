import { buildMonthGrid, currentRun } from '../historyRules';

describe('buildMonthGrid', () => {
  it('pads leading blanks to the first weekday and includes every day', () => {
    // September 2026 starts on a Tuesday (weekday index 2).
    const cells = buildMonthGrid(2026, 8, new Map(), '2026-09-14');
    expect(cells.slice(0, 2)).toEqual([
      { date: null, day: null, mood: null, isToday: false },
      { date: null, day: null, mood: null, isToday: false },
    ]);
    expect(cells).toHaveLength(2 + 30);
    expect(cells[2]).toMatchObject({ date: '2026-09-01', day: 1 });
    expect(cells.at(-1)).toMatchObject({ date: '2026-09-30', day: 30 });
  });

  it('marks today and attaches logged mood', () => {
    const moods = new Map([['2026-09-14', 4]]);
    const cells = buildMonthGrid(2026, 8, moods, '2026-09-14');
    const today = cells.find((c) => c.date === '2026-09-14');
    expect(today).toMatchObject({ mood: 4, isToday: true });
    const other = cells.find((c) => c.date === '2026-09-13');
    expect(other).toMatchObject({ mood: null, isToday: false });
  });
});

describe('currentRun', () => {
  it('counts consecutive nights ending today when today is logged', () => {
    const logged = new Set(['2026-09-12', '2026-09-13', '2026-09-14']);
    expect(currentRun(logged, '2026-09-14')).toBe(3);
  });

  it('counts back from yesterday when today is not yet logged', () => {
    const logged = new Set(['2026-09-12', '2026-09-13']);
    expect(currentRun(logged, '2026-09-14')).toBe(2);
  });

  it('stops at the first gap', () => {
    const logged = new Set(['2026-09-10', '2026-09-13', '2026-09-14']);
    expect(currentRun(logged, '2026-09-14')).toBe(2);
  });

  it('is zero with nothing logged', () => {
    expect(currentRun(new Set(), '2026-09-14')).toBe(0);
  });
});

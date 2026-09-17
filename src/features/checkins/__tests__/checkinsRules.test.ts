import { assertWithinBacklogWindow, BacklogWindowError, resolveSource } from '../checkinsRules';

describe('assertWithinBacklogWindow', () => {
  const today = '2026-09-17';

  it('allows today', () => {
    expect(() => assertWithinBacklogWindow(today, today)).not.toThrow();
  });

  it('allows exactly 3 days back', () => {
    expect(() => assertWithinBacklogWindow('2026-09-14', today)).not.toThrow();
  });

  it('rejects 4 days back', () => {
    expect(() => assertWithinBacklogWindow('2026-09-13', today)).toThrow(BacklogWindowError);
  });

  it('rejects a future date', () => {
    expect(() => assertWithinBacklogWindow('2026-09-18', today)).toThrow(BacklogWindowError);
  });
});

describe('resolveSource', () => {
  it('is manual for today', () => {
    expect(resolveSource('2026-09-17', '2026-09-17')).toBe('manual');
  });

  it('is backlog for a past date', () => {
    expect(resolveSource('2026-09-15', '2026-09-17')).toBe('backlog');
  });
});

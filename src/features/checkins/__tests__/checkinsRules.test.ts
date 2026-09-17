import {
  assertWithinBacklogWindow,
  BacklogWindowError,
  resolveSource,
  shouldAdoptServerRow,
} from '../checkinsRules';

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

describe('shouldAdoptServerRow', () => {
  it('always adopts when nothing exists locally yet', () => {
    expect(shouldAdoptServerRow(null, '2026-09-17T10:00:00.000Z')).toBe(true);
  });

  it('adopts when the server row is strictly newer', () => {
    expect(shouldAdoptServerRow('2026-09-17T10:00:00.000Z', '2026-09-17T10:00:01.000Z')).toBe(true);
  });

  it('keeps the local row when it is strictly newer', () => {
    expect(shouldAdoptServerRow('2026-09-17T10:00:01.000Z', '2026-09-17T10:00:00.000Z')).toBe(false);
  });

  it('keeps the local row on a tie — it is already pending its own push', () => {
    expect(shouldAdoptServerRow('2026-09-17T10:00:00.000Z', '2026-09-17T10:00:00.000Z')).toBe(false);
  });
});

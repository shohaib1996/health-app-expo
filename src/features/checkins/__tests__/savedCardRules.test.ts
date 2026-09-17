import { pickSavedVariant } from '../savedCardRules';

describe('pickSavedVariant', () => {
  it('calls out the 21-night pattern threshold specially', () => {
    expect(pickSavedVariant(21)).toEqual({
      kind: 'milestone',
      nights: 21,
      message: "That's 21 nights. Enough to start looking for patterns.",
    });
  });

  it('treats other milestones as a plain count', () => {
    expect(pickSavedVariant(7)).toMatchObject({ kind: 'milestone', message: "That's 7 nights logged." });
  });

  it('counts down to the threshold before it is reached', () => {
    expect(pickSavedVariant(5)).toEqual({
      kind: 'ordinary',
      message: 'Logged. 16 more nights before patterns are testable.',
    });
  });

  it('uses singular "night" when exactly one remains', () => {
    expect(pickSavedVariant(20)).toEqual({
      kind: 'ordinary',
      message: 'Logged. 1 more night before patterns are testable.',
    });
  });

  it('is a plain "Logged." past the threshold on a non-milestone night', () => {
    expect(pickSavedVariant(25)).toEqual({ kind: 'ordinary', message: 'Logged.' });
  });
});

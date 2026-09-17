/** Mood dot intensity on the S-30 calendar: coarse 3-step neutral ramp,
 * not a 5-step gradient, so adjacent days stay visually distinguishable
 * at dot size. Mood is raw logged data, not a confidence signal — it
 * never uses the accent ramp (see Nocturne component-sheet annotation). */
export function moodNeutralStep(mood: number): 300 | 500 | 700 {
  if (mood <= 2) return 700;
  if (mood === 3) return 500;
  return 300;
}

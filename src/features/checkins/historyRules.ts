/** Pure calendar/stat logic for S-30, isolated from SQLite so it's
 * unit-testable without a native module (same pattern as
 * checkinsRules.ts). Dates are 'YYYY-MM-DD' local-date strings
 * throughout — see src/lib/localDate.ts. */

export interface MonthCell {
  date: string | null; // null for the leading blanks before day 1
  day: number | null;
  mood: number | null; // 1-5, null if nothing logged that day
  isToday: boolean;
}

/** Sunday-first grid (matches the S-30 mockup's weekday header). */
export function buildMonthGrid(
  year: number,
  month: number, // 0-11
  moodByDate: ReadonlyMap<string, number>,
  todayDate: string,
): MonthCell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: MonthCell[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ date: null, day: null, mood: null, isToday: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      date,
      day,
      mood: moodByDate.get(date) ?? null,
      isToday: date === todayDate,
    });
  }
  return cells;
}

/** Consecutive logged nights ending today (or yesterday, if today isn't
 * logged yet — a run isn't broken until a day is actually skipped). */
export function currentRun(loggedDates: ReadonlySet<string>, todayDate: string): number {
  let run = 0;
  const cursor = new Date(`${todayDate}T00:00:00`);
  if (!loggedDates.has(todayDate)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  for (;;) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    if (!loggedDates.has(key)) break;
    run += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return run;
}

/** Mirrors app/modules/tags/seed.py exactly — the fixed ~20-tag launch
 * catalog (§5.4). Users cannot add tags; TagKey closes the set on the
 * backend, and there is no client affordance to invent one either. */

export type TagCategory = 'substances' | 'sleep' | 'body' | 'day_shape' | 'social' | 'screen';

export interface TagDefinition {
  key: string;
  label: string;
  category: TagCategory;
  sortOrder: number;
}

export const TAG_CATALOG_VERSION = 1;

export const TAG_CATALOG: TagDefinition[] = [
  { key: 'caffeine_after_2pm', label: 'Caffeine after 2pm', category: 'substances', sortOrder: 0 },
  { key: 'alcohol', label: 'Alcohol', category: 'substances', sortOrder: 1 },
  { key: 'no_caffeine', label: 'No caffeine', category: 'substances', sortOrder: 2 },
  { key: 'late_to_bed', label: 'Late to bed', category: 'sleep', sortOrder: 3 },
  { key: 'woke_in_the_night', label: 'Woke in the night', category: 'sleep', sortOrder: 4 },
  { key: 'early_start', label: 'Early start', category: 'sleep', sortOrder: 5 },
  { key: 'workout', label: 'Workout', category: 'body', sortOrder: 6 },
  { key: 'long_walk', label: 'Long walk', category: 'body', sortOrder: 7 },
  { key: 'sore', label: 'Sore', category: 'body', sortOrder: 8 },
  { key: 'unwell', label: 'Unwell', category: 'body', sortOrder: 9 },
  { key: 'period', label: 'Period', category: 'body', sortOrder: 10 },
  { key: 'heavy_workload', label: 'Heavy workload', category: 'day_shape', sortOrder: 11 },
  { key: 'deadline', label: 'Deadline', category: 'day_shape', sortOrder: 12 },
  { key: 'travel', label: 'Travel', category: 'day_shape', sortOrder: 13 },
  { key: 'day_off', label: 'Day off', category: 'day_shape', sortOrder: 14 },
  { key: 'saw_friends', label: 'Saw friends', category: 'social', sortOrder: 15 },
  { key: 'conflict', label: 'Conflict', category: 'social', sortOrder: 16 },
  { key: 'alone_all_day', label: 'Alone all day', category: 'social', sortOrder: 17 },
  { key: 'late_screen_time', label: 'Late screen time', category: 'screen', sortOrder: 18 },
  { key: 'doomscrolled', label: 'Doomscrolled', category: 'screen', sortOrder: 19 },
];

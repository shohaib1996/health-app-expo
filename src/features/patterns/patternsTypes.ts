/** Mirrors app/modules/patterns/schemas.py. patterns is storage-only
 * server-side (§1.2/§5.6) — the on-device engine (not yet built, see
 * docs/DECISIONS.md §6) is what would produce these; this client is
 * only ever a reader until that exists. */

export type PatternState = 'supported' | 'inconclusive' | 'insufficient_data';

export interface PatternRow {
  localDate: string;
  value: number;
}

export interface Pattern {
  id: string;
  clientId: string;
  kind: string;
  state: PatternState;
  headline: string;
  effectSummary: string | null;
  n: number | null;
  rows: PatternRow[];
  createdAt: string;
  updatedAt: string;
}

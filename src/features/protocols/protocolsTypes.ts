/** Mirrors app/modules/protocols/schemas.py. The library is curated
 * YAML, validated at startup, synced to the backend DB — `key` is the
 * public ID (not the UUID pk), per §5.7. */

export interface Protocol {
  key: string;
  name: string;
  focusArea: string;
  domain: string;
  durationDays: number;
  cueSuggestion: string;
  actionSuggestion: string;
  evidenceNote: string;
  description: string;
  contraindications: string[];
}

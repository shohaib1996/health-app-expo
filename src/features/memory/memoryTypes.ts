/** Mirrors app/modules/memory/schemas.py. */

export type MemoryCategory = 'told_you' | 'seen' | 'worked' | 'didnt_work';

export interface MemoryEntry {
  id: string;
  category: MemoryCategory;
  text: string;
  sourceType: string | null;
  sourceId: string | null;
  derivedFromId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryEntryUpdate {
  text: string;
}

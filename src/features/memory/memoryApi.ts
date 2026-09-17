import { apiClient } from '@/api/client';

import type { MemoryEntry, MemoryEntryUpdate } from './memoryTypes';

/** No create endpoint — entries only ever appear as a side effect of
 * other modules calling MemoryService.record() server-side (§5.6).
 * Nothing calls it yet (docs/PROGRESS.md), so GET here is expected to
 * come back empty until that wiring lands. */
export const memoryApi = {
  list: () => apiClient.get<MemoryEntry[]>('/memory').then((r) => r.data),

  update: (entryId: string, payload: MemoryEntryUpdate) =>
    apiClient.patch<MemoryEntry>(`/memory/${entryId}`, payload).then((r) => r.data),

  remove: (entryId: string) => apiClient.delete<void>(`/memory/${entryId}`).then((r) => r.data),
};

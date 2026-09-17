import type { ConfidenceRole } from '@/components/ui/ConfidenceDot';

import type { PatternState } from './patternsTypes';

/** The engine's three states, 1:1 with the three confidence tokens —
 * same mapping the backend's PatternState enum carries (§5.6). */
export const ROLE_BY_PATTERN_STATE: Record<PatternState, ConfidenceRole> = {
  supported: 'supported',
  inconclusive: 'noEffect',
  insufficient_data: 'insufficientData',
};

export const LABEL_BY_PATTERN_STATE: Record<PatternState, string> = {
  supported: 'Holds up',
  inconclusive: 'Tested, no clear answer',
  insufficient_data: 'Still collecting',
};

/** Mirrors app/modules/experiments/schemas.py. Dates are 'YYYY-MM-DD'
 * strings on the wire (Pydantic `date` serializes that way through
 * FastAPI's JSON encoder). */

export interface ProposeRequest {
  excludeKeys?: string[];
}

export interface ProposalResponse {
  protocolKey: string;
  name: string;
  focusArea: string;
  durationDays: number;
  whyThisOne: string;
  cueSuggestion: string;
  actionSuggestion: string;
  contraindications: string[];
}

export interface ExperimentCreate {
  clientId: string;
  protocolKey: string;
  cueText: string;
  actionText: string;
  startDate: string;
}

export interface AdherenceMark {
  localDate: string;
  kept: boolean;
}

export interface AbandonRequest {
  reason: string;
}

export type AdherenceState = 'done' | 'missed' | 'not_yet';

export interface AdherenceDay {
  localDate: string;
  state: AdherenceState;
}

export type ExperimentStatus = 'active' | 'completed' | 'abandoned';

export interface ActiveExperimentResponse {
  id: string;
  protocolKey: string;
  protocolName: string;
  status: ExperimentStatus;
  cueText: string;
  actionText: string;
  startDate: string;
  verdictDueOn: string;
  durationDays: number;
  dayNumber: number;
  adherence: AdherenceDay[];
  keptDays: number;
  missedDays: number;
}

export type VerdictType = 'worked' | 'didnt_work' | 'inconclusive';

export interface VerdictResponse {
  id: string;
  protocolKey: string;
  protocolName: string;
  durationDays: number;
  keptDays: number;
  verdictType: VerdictType;
  heroDelta: number | null;
  heroUnit: string | null;
  likelyRangeLow: number | null;
  likelyRangeHigh: number | null;
  beforeAverage: number | null;
  duringAverage: number | null;
  secondaryMetric: string | null;
  secondaryChanged: boolean | null;
  secondaryBeforeAverage: number | null;
  secondaryDuringAverage: number | null;
  reason: string | null;
}

export interface ExperimentHistoryItem {
  id: string;
  protocolKey: string;
  protocolName: string;
  status: ExperimentStatus;
  startDate: string;
  verdictDueOn: string;
  verdictType: VerdictType | null;
  heroDelta: number | null;
  heroUnit: string | null;
}

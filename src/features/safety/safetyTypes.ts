/** Mirrors app/modules/safety/schemas.py. */

export interface CrisisResource {
  name: string;
  phone: string | null;
  sms: string | null;
  url: string | null;
  description: string | null;
}

export interface SafetyResourcesResponse {
  region: string;
  resources: CrisisResource[];
}

export type ReportReason = 'wrong' | 'made_up' | 'felt_harmful' | 'doesnt_apply';

export interface SafetyReportCreate {
  aiCallId: string;
  surface: string;
  reason: ReportReason;
  detail?: string | null;
}

export interface SafetyReportResponse {
  id: string;
  reason: ReportReason;
  createdAt: string;
}

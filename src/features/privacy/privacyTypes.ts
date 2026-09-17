/** Mirrors app/modules/privacy/schemas.py. */

export interface ExportJobResponse {
  id: string;
  status: string;
  exportJson: Record<string, unknown> | null;
  exportCsv: string | null;
  completedAt: string | null;
}

export interface DeletionRequestCreate {
  /** Only required if the account has a linked email/password login —
   * anonymous accounts (the default, §5.1) skip re-auth entirely. */
  password?: string | null;
}

export interface DeletionRequestResponse {
  id: string;
  status: string;
  scheduledFor: string;
}

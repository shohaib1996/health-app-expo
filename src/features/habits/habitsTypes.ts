/** Mirrors app/modules/habits/schemas.py. */

export type MaintenanceFrequency = 'weekly' | 'monthly' | 'none';
export type HabitStatus = 'active' | 'archived';

export interface HabitCreate {
  clientId: string;
  protocolKey: string;
  sourceExperimentId?: string | null;
  maintenanceFrequency: MaintenanceFrequency;
}

export interface HabitUpdate {
  maintenanceFrequency?: MaintenanceFrequency;
  status?: HabitStatus;
}

export interface HabitResponse {
  id: string;
  protocolKey: string;
  protocolName: string;
  sourceExperimentId: string | null;
  maintenanceFrequency: MaintenanceFrequency;
  status: HabitStatus;
  createdAt: string;
  updatedAt: string;
}

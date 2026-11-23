import type { UpdateAppointmentRequest } from "./Appointment";

export const VISIT_STATUSES = [
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type VisitStatus = (typeof VISIT_STATUSES)[number];

export interface Visit {
  visitId: number;
  appointmentId: number;
  billingId: number | null;
  reason: string;
  diagnosis: string | null;
  treatment: string | null;
  medication: string | null;
  visitNotes: string | null;
  indication: string | null;
  status: VisitStatus;
}

export interface CreateVisitRequest {
  appointment: UpdateAppointmentRequest;
  reason: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  visitNotes: string;
  indication: string;
  status: VisitStatus;
}

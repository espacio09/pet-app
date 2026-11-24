import type { UpdateAppointmentRequest } from "./Appointment";

export const VISIT_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "FOLLOW_UP_REQUIRED",
] as const;

export type VisitStatus = (typeof VISIT_STATUSES)[number];

export interface Visit {
  visitId: number;
  appointmentId: number | null;
  billingId: number | null;
  reason: string;
  diagnosis: string | null;
  treatment: string | null;
  medication: string | null;
  visitNotes: string | null;
  indication: string | null;
  visitStatus: VisitStatus;
}

export interface VisitListItem extends Visit {
  visitDate: string;
  petId: number;
  petName: string | null;
  ownerName: string | null;
  vet: string | null;
}

export interface CreateVisitRequest {
  appointment: UpdateAppointmentRequest;
  reason: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  visitNotes: string;
  indication: string;
  visitStatus: VisitStatus;
}

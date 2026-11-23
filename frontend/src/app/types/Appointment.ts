export const APPOINTMENT_STATUSES = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_REASONS = [
  "Vaccination",
  "Eye Examination",
  "Dientes",
  "General Check-up",
  "Consultation",
  "Injury",
  "Illness",
  "Surgery Follow-up",
  "Emergency",
] as const;

export interface Appointment {
  appointmentId: number;
  petId: number;
  vetId: number;
  appointmentDate: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string | null;
  vet?: string;
  petName?: string;
  ownerName?: string | null;
}

export interface CreateAppointmentRequest {
  petId: number;
  vetId: number;
  appointmentDate: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface DeleteAppointmentsRequest {
  appointmentIds: number[];
}

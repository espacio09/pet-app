export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

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

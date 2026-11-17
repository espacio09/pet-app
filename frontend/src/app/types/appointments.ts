import type {
  Appointment,
  CreateAppointmentRequest,
} from "./Appointment";
import { getUserFacingHttpErrorMessage } from "../shared/utils/user-facing-error";

const API_URL = "http://localhost:3002";

async function ensureOk(response: Response, fallback: string): Promise<void> {
  if (!response.ok) {
    throw new Error(await getUserFacingHttpErrorMessage(response, fallback));
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments`);
  await ensureOk(response, "No se pudieron cargar las citas.");
  return response.json();
}

export async function getPetAppointments(
  petId: number,
): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/pets/${petId}/appointments`);
  await ensureOk(response, "No se pudieron cargar las citas.");
  return response.json();
}

export async function createAppointment(
  appointment: CreateAppointmentRequest,
): Promise<Appointment> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment),
  });
  await ensureOk(response, "No se pudo crear la cita.");
  return response.json();
}

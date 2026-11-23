import type { CreateVisitRequest, Visit } from "./Visit";
import { getUserFacingHttpErrorMessage } from "../shared/utils/user-facing-error";

const API_URL = "http://localhost:3002";

export async function createVisit(
  appointmentId: number,
  visit: CreateVisitRequest,
): Promise<Visit> {
  const response = await fetch(
    `${API_URL}/appointments/${appointmentId}/visits`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visit),
    },
  );
  if (!response.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(
        response,
        "No se pudo crear la visita.",
      ),
    );
  }
  return response.json();
}

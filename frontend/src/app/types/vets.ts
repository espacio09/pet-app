import type { CreateVetRequest, UpdateVetRequest, VetApi } from "./Vet";

const API_URL = "http://localhost:3002/vets";

async function getApiErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "message" in body) {
      const message = body.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.join(", ");
    }
  } catch {
    // The response may not contain JSON.
  }

  return response.statusText || "Error en la solicitud de veterinarios.";
}

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }
}

export async function getVets(): Promise<VetApi[]> {
  const response = await fetch(API_URL);
  await ensureOk(response);
  return response.json();
}

export async function createVet(vet: CreateVetRequest) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vet),
  });
  await ensureOk(response);
  return response.json();
}

export async function updateVet(vetId: number, vet: UpdateVetRequest) {
  const response = await fetch(`${API_URL}/${vetId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vet),
  });
  await ensureOk(response);
  return response.json();
}

export async function deleteVet(vetId: number) {
  const response = await fetch(`${API_URL}/${vetId}`, { method: "DELETE" });
  await ensureOk(response);
  return response.json();
}

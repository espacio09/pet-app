import type { CreateVetRequest, UpdateVetRequest, VetApi } from "./Vet";
import { getUserFacingHttpErrorMessage } from "../shared/utils/user-facing-error";

const API_URL = "http://localhost:3002/vets";

async function ensureOk(response: Response, fallback: string): Promise<void> {
  if (!response.ok) {
    throw new Error(await getUserFacingHttpErrorMessage(response, fallback));
  }
}

export async function getVets(): Promise<VetApi[]> {
  const response = await fetch(API_URL);
  await ensureOk(response, "No se pudieron cargar los veterinarios.");
  return response.json();
}

export async function createVet(vet: CreateVetRequest) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vet),
  });
  await ensureOk(response, "No se pudo guardar el veterinario.");
  return response.json();
}

export async function updateVet(vetId: number, vet: UpdateVetRequest) {

  console.log("vet:", vet);
  console.log("json:", JSON.stringify(vet));
  

  const response = await fetch(`${API_URL}/${vetId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vet),
  });
  await ensureOk(response, "No se pudo actualizar el veterinario.");
  return response.json();

}

export async function deleteVet(vetId: number) {
  const response = await fetch(`${API_URL}/${vetId}`, { method: "DELETE" });
  await ensureOk(response, "No se pudo eliminar el veterinario.");
  return response.json();
}

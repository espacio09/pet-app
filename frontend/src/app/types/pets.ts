import type {
  CreatePetRequest,
  UpdatePetRequest,
} from "../types/Pet";

export async function getPets() {
  const res = await fetch("http://localhost:3002/pets");

  if (!res.ok) {
    throw new Error("API error: " + res.statusText);
  }

  return res.json();
}

export async function createPet(pet: CreatePetRequest) {
  const res = await fetch("http://localhost:3002/pets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(error);
    throw new Error(error);
  }

  return res.json();
}

export async function updatePet(
  id: number,
  pet: UpdatePetRequest,
) {
  const res = await fetch(`http://localhost:3002/pets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
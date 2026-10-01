import type {
  CreatePetRequest,
  UpdatePetRequest,
} from "../types/Pet";

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "message" in body) {
      const message = body.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.join(", ");
    }
  } catch {
    // Fall back to the HTTP status when the response is not JSON.
  }

  return response.statusText || "Request failed.";
}

export async function getPets() {
  const res = await fetch("http://localhost:3002/pets");

  if (!res.ok) {
    throw new Error("API error: " + res.statusText);
  }
  const pets = await res.json();
  console.log("Pets:", pets);
  return pets;
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
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}

export async function getBreedId(breedName: string): Promise<number | null> {
  const params = new URLSearchParams({ breedName });
  const res = await fetch(
    `http://localhost:3002/pets/breed-id?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error("Could not look up breed.");
  }

  const result: { breed_id: number | null } = await res.json();
  return result.breed_id;
}

export async function checkMicrochipAvailability(
  microchipNo: number,
  excludePetId?: number,
): Promise<boolean> {
  const params = new URLSearchParams({ microchipNo: String(microchipNo) });
  if (excludePetId !== undefined) {
    params.set("excludePetId", String(excludePetId));
  }

  const res = await fetch(
    `http://localhost:3002/pets/microchip-availability?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  const result: { available: boolean } = await res.json();
  return result.available;
}

export async function updatePet(
  pet_id: number,
  pet: UpdatePetRequest,
) {
  const res = await fetch(`http://localhost:3002/pets/${pet_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
}
import type {
  CreatePetRequest,
  UpdatePetRequest,
} from "../types/Pet";
import { getUserFacingHttpErrorMessage } from "../shared/utils/user-facing-error";

export async function getPets() {
  const res = await fetch("http://localhost:3002/pets");

  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudieron cargar las mascotas."),
    );
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
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudo guardar la mascota."),
    );
  }

  return res.json();
}

export async function getBreedId(breedName: string): Promise<number | null> {
  const params = new URLSearchParams({ breedName });
  const res = await fetch(
    `http://localhost:3002/pets/breed-id?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudo buscar la raza."),
    );
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
    throw new Error(
      await getUserFacingHttpErrorMessage(
        res,
        "No se pudo comprobar la disponibilidad del microchip.",
      ),
    );
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
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudo actualizar la mascota."),
    );
  }

  return res.json();
}

export async function deletePets(petIds: number[]) {
  const res = await fetch("http://localhost:3002/pets", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petIds }),
  });

  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudieron eliminar las mascotas."),
    );
  }

  return res.json();
}
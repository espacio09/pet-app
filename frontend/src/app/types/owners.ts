import type {
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from "../types/Owner";
import { getUserFacingHttpErrorMessage } from "../shared/utils/user-facing-error";

export async function getOwners() {
  const res = await fetch("http://localhost:3002/owners");
  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(
        res,
        "No se pudieron cargar los propietarios.",
      ),
    );
  }

  return res.json();
}

export async function createOwner(owner: CreateOwnerRequest) {
  const res = await fetch("http://localhost:3002/owners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(owner),
  });

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    if (
      body &&
      typeof body === "object" &&
      "code" in body &&
      body.code === "DUPLICATE_OWNER_NAME"
    ) {
      throw new DuplicateOwnerNameError(
        "Ya existe un propietario con ese nombre. Comprueba los datos e inténtalo de nuevo.",
      );
    }
    throw new Error(
      await getUserFacingHttpErrorMessage(
        res,
        "No se pudo guardar el propietario.",
        body,
      ),
    );
  }

  return res.json();
}

export class DuplicateOwnerNameError extends Error {}



export async function updateOwner(
  owner_id: number,
  owner: UpdateOwnerRequest,
) {
  const res = await fetch(`http://localhost:3002/owners/${owner_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(owner),
  });

  const responseBody: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(
        res,
        "No se pudo actualizar el propietario.",
        responseBody,
      ),
    );
  }

  return responseBody;
}

export async function deleteOwner(ownerId: number) {
  const res = await fetch(`http://localhost:3002/owners/${ownerId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudo eliminar el propietario."),
    );
  }

  return res.json().catch(() => null);
}

export async function deleteOwners(ownerIds: number[]) {
  const res = await fetch("http://localhost:3002/owners", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerIds }),
  });

  if (!res.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(res, "No se pudieron eliminar los propietarios."),
    );
  }

  return res.json();
}

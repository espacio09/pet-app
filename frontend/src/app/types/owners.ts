import type {
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from "../types/Owner";


export async function getOwners() {
  try {
   

    const res = await fetch("http://localhost:3002/owners");

    console.log("Status:", res.status);
    console.log("OK:", res.ok);

    const text = await res.text();

    console.log("Respuesta RAW:", text);

    return JSON.parse(text);
  } catch (error) {
    console.error("ERROR FETCH OWNERS:", error);
    throw error;
  }
}


/*export async function getOwners() {
  const res = await fetch("http://localhost:3002/owners");

  if (!res.ok) {
    throw new Error("API error: " + res.statusText);
  }

  return res.json();
}
*/


export async function createOwner(owner: CreateOwnerRequest) {
  const res = await fetch("http://localhost:3002/owners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(owner),
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res));
  }

  return res.json();
}



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
    throw new Error(getApiErrorMessageFromBody(responseBody));
  }

  return responseBody;
}

export async function deleteOwner(ownerId: number) {
  const res = await fetch(`http://localhost:3002/owners/${ownerId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res));
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
    throw new Error(await getApiErrorMessage(res));
  }

  return res.json();
}

async function getApiErrorMessage(response: Response) {
  const body: unknown = await response.json().catch(() => null);
  return getApiErrorMessageFromBody(body);
}

function getApiErrorMessageFromBody(body: unknown) {
  if (body && typeof body === "object" && "message" in body) {
    const message = body.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }

  return "No se pudo guardar el propietario.";
}
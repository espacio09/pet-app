import type {
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from "../types/Owner";

export async function getOwners() {
  const res = await fetch("http://localhost:3002/owners");

  if (!res.ok) {
    throw new Error("API error: " + res.statusText);
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
    const error = await res.text();
    console.error(error);
    throw new Error(error);
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

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
export async function getPets() {
  const res = await fetch("http://localhost:3002/pets");

  if (!res.ok) {
    throw new Error("API error: " + res.statusText);
  }

  return res.json();
}
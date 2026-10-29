import type { Vet } from "../types/Vet";

type VetCardProps = {
  vet: Vet;
};

export default function VetCard({ vet }: VetCardProps) {
  const vetName =
    `${vet.firstName ?? vet.first_name ?? ""} ${
      vet.lastName ?? vet.last_name ?? ""
    }`.trim() || vet.name || "";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <h3>{vetName || "Sin veterinario"}</h3>

      <p>
        <strong>Veterinario ID:</strong> {vet.vetId}
      </p>

      <p>
        <strong>Email:</strong> {vet.email}
      </p>

      <p>
        <strong>Propietario:</strong>{" "}
        {vet.specialty || `Veterinario ID: ${vet.vetId}`}
      </p>

     
    </div>
  );
}
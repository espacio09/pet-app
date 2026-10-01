import type { Owner } from "../types/Owner";

type OwnerCardProps = {
  owner: Owner;
};

export default function OwnerCard({ owner }: OwnerCardProps) {
  const ownerName = `${owner.firstName ?? owner.first_name ?? ""} ${
    owner.lastName ?? owner.last_name ?? ""
  }`.trim();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <h3>{ownerName || "Sin propietario"}</h3>

      <p>
        <strong>Owner ID:</strong> {owner.ownerId}
      </p>

      <p>
        <strong>Email:</strong> {owner.email}
      </p>

      <p>
        <strong>Propietario:</strong>{" "}
        {ownerName || `Owner ID: ${owner.ownerId}`}
      </p>

     
    </div>
  );
}
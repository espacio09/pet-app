import type { Pet } from "../types/Pet";

type PetCardProps = {
  pet: Pet;
};

export default function PetCard({ pet }: PetCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <h3>{pet.petName}</h3>


      <p>
        <strong>Tipo:</strong> {pet.petId}
      </p>

        <p>
        <strong>Tipo:</strong> {pet.microchip_no}
      </p>

      <p>
        <strong>Propietario:</strong> {pet.ownerId}
      </p>

        <p>
        <strong>Birthdate:</strong> {pet.birthdate ? pet.birthdate.toDateString() : "N/A"}
      </p>
      <p>
        <strong>Edad:</strong> {pet.age}
      </p>
    </div>
  );
}
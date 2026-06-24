import type { Pet } from "./types/Pet";
import { PetRow } from "./PetRow";

type Props = {
  pets: Pet[];
  onSelect: (pet: Pet) => void;
};

export default function PetsList() {
  return <div>Pets List works ✅</div>;
}

const PetsList = ({ pets, onSelect }: Props) => {
  if (!pets.length) {
    return <p className="text-gray-500">No hay mascotas aún</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Nombre</th>
            <th className="text-left p-3">Tipo</th>
            <th className="text-left p-3">Edad</th>
            <th className="text-left p-3">Raza</th>
          </tr>
        </thead>

        <tbody>
          {pets.map((pet) => (
            <PetRow
              key={pet.petId}
              pet={pet}
              onSelect={onSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
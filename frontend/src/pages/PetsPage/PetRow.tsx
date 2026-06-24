import type { Pet } from "./types/Pet";

type Props = {
  pet: Pet;
  onSelect: (pet: Pet) => void;
};

export const PetRow = ({ pet, onSelect }: Props) => {
  return (
    <tr
      onClick={() => onSelect(pet)}
      className="cursor-pointer border-t hover:bg-gray-50 transition"
    >
      <td className="p-3">{pet.petId}</td>
      <td className="p-3">{pet.petName}</td>
      <td className="p-3">{pet.pet_type_id}</td>
      <td className="p-3">{pet.age}</td>
      <td className="p-3">{pet.breed_id}</td>
    </tr>
  );
};
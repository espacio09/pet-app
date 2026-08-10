import { useEffect, useState } from "react";
import type { Pet, PetApi } from "../models/Pet";
import { getPets } from "../models/pets";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

 const loadPets = async () => {
  try {
    const data = await getPets();

    setPets(
      data.map((pet: PetApi) => ({
        petId: pet.pet_id,
        petName: pet.pet_name,
        sex: pet.sex,
        weight: pet.weight,
        birthdate: pet.birthdate,
        microchipNo: pet.microchip_no,
        ownerId: pet.ownerId,
        color: pet.color,
        petTypeId: pet.pet_typeId,
        breedTypeId: pet.breed_id,
        age: pet.birthdate
          ? Math.floor(
              (Date.now() -
                new Date(pet.birthdate).getTime()) /
                (1000 * 60 * 60 * 24 * 365.25)
            )
          : 0,
      }))
    );
  } catch (err) {
    console.error(err);
    setError(true);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const load = async () => {
    await loadPets();
  };

  void load();
}, []);



 return {
  pets,
  loading,
  error,
  loadPets,

};
}

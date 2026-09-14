import { useEffect, useState } from "react";
import type { Pet, PetApi } from "../types/Pet";
import { getPets } from "../types/pets";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

 const loadPets = async () => {
  try {
    const data = await getPets();

    console.log("Primer Pet API:", data[0]);


    setPets(
      data.map((pet: PetApi) => {
        const ownerId = pet.ownerId ?? pet.owner_id;

        return {
          petId: pet.pet_id,
          petName: pet.pet_name,
          sex: pet.sex,
          weight: pet.weight,
          birthdate: new Date(pet.birthdate),
          microchip_no: pet.microchip_no,
          ownerId: ownerId ?? 0,
          ownerFirstName: pet.ownerFirstName,
          ownerLastName: pet.ownerLastName,
          ownerName: pet.owner_name,
          ownerBirthdate: pet.owner_birthdate,
          color: pet.color,
          petTypeId: pet.pet_typeId,
          breed_id: pet.breed_id,
          breedName: pet.breed_name,
          age: pet.birthdate
            ? Math.floor(
                (Date.now() -
                  new Date(pet.birthdate).getTime()) /
                  (1000 * 60 * 60 * 24 * 365.25)
              )
            : 0,
        };
      })
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

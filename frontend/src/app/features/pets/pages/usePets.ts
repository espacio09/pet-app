import { useEffect, useState } from "react";
import type { Pet, PetApi } from "../models/Pet";
import { getPets } from "../models/pets";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    console.log("usePets iniciado");

    getPets()
      .then((data) => {

 setPets(
  data.map((pet: PetApi) => ({
    petId: pet.pet_id,
    petName: pet.pet_name,
    sex: pet.sex,
    weight: pet.weight,
    birthdate: pet.birthdate,
    microchipNo: pet.microchip_no,
    ownerId: pet.owner_id,
    color: pet.color,
    petTypeId: pet.pet_type_id,
    breedId: pet.breed_id,
    age: Math.floor(
      (new Date().getTime() - new Date(pet.birthdate).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    ),
  }))

);

      })
      .catch((err) => {
        console.error("error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    pets,
    loading,
    error,
  };
}
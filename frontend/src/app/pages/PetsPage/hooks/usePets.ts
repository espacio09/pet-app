import { useEffect, useState } from "react";
import type { Pet } from "../../../types/Pet";
import { getPets } from "../../../api/pets";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    console.log("usePets iniciado");

    getPets()
      .then((data) => {

 setPets(
  data.map((pet: any) => ({
    petId: pet.pet_id,
    petName: pet.pet_name,
    sex: pet.sex,
    weight: pet.weight,
    birthdate: pet.birthdate,
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
import { useEffect, useState } from "react";
import type { Pet } from "../../../types/Pet";
import { getPets } from "../../../api/pets";


export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPets()
      .then(setPets)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return {
    pets,
    loading,
    error,
  };
}
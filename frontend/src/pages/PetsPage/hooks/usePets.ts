import { useEffect, useState } from "react";
import type { Pet } from "../types/Pet";
import { petService } from "../services/petService";

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);

        const data = await petService.getAll();

        setPets(data);
      } catch (err) {
        setError("Error al cargar mascotas");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return { pets, loading, error };
};
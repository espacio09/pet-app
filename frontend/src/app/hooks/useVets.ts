import { useCallback, useEffect, useState } from "react";
import type { Vet, VetApi } from "../types/Vet";
import { getVets } from "../types/vets";

export function useVets() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reloadVets = useCallback(async () => {
    setError(false);

    try {
      const data: VetApi[] = await getVets();
      const mappedVets = data.map((vet) => ({
        ...vet,
        vetId: vet.vetId ?? vet.id ?? 0,
        firstName: vet.firstName ?? vet.first_name ?? vet.name ?? "",
        lastName: vet.lastName ?? vet.last_name ?? "",
        phone: vet.phone ?? vet.phoneNumber ?? "",
      }));

      setVets(mappedVets);
      return mappedVets;
    } catch (err) {
      setError(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadVets().catch(() => undefined);
  }, [reloadVets]);

  return {
    vets,
    loading,
    error,
    reloadVets,
  };
}

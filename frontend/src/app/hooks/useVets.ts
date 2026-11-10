import { useCallback, useEffect, useState } from "react";
import type { Vet, VetApi } from "../types/Vet";
import { getVets } from "../types/vets";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

export function useVets() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadVets = useCallback(async () => {
    setError(null);

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
      setError(
        getUserFacingErrorMessage(
          err,
          "No se pudieron cargar los veterinarios. Inténtalo de nuevo.",
        ),
      );
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

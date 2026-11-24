import { useCallback, useEffect, useState } from "react";
import type { VisitListItem } from "../types/Visit";
import { getVisits } from "../types/visits";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

export function useVisits() {
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadVisits = useCallback(async () => {
    setError("");

    try {
      const result = await getVisits();
      setVisits(result);
      return result;
    } catch (requestError) {
      setError(
        getUserFacingErrorMessage(
          requestError,
          "No se pudieron cargar las visitas. Inténtalo de nuevo.",
        ),
      );
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadVisits().catch(() => undefined);
  }, [reloadVisits]);

  return { visits, loading, error, reloadVisits };
}

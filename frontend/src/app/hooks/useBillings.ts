import { useCallback, useEffect, useState } from "react";
import type { BillingListItem } from "../types/Billing";
import { getBillings } from "../types/billings";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

export function useBillings() {
  const [billings, setBillings] = useState<BillingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadBillings = useCallback(async () => {
    setError("");

    try {
      const result = await getBillings();
      setBillings(result);
      return result;
    } catch (requestError) {
      setError(
        getUserFacingErrorMessage(
          requestError,
          "No se pudieron cargar los billings. Inténtalo de nuevo.",
        ),
      );
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadBillings().catch(() => undefined);
  }, [reloadBillings]);

  return { billings, loading, error, reloadBillings };
}

import { useCallback, useEffect, useState } from "react";
import type { Appointment } from "../types/Appointment";
import { getAppointments } from "../types/appointments";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reloadAppointments = useCallback(async () => {
    setError("");

    try {
      const result = await getAppointments();
      setAppointments(result);
      return result;
    } catch (requestError) {
      setError(
        getUserFacingErrorMessage(
          requestError,
          "No se pudieron cargar las citas. Inténtalo de nuevo.",
        ),
      );
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAppointments().catch(() => undefined);
  }, [reloadAppointments]);

  return { appointments, loading, error, reloadAppointments };
}

import { useCallback, useEffect, useState } from "react";
import type { Owner, OwnerApi } from "../types/Owner";
import { getOwners } from "../types/owners";

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reloadOwners = useCallback(async () => {
    setError(false);

    try {
      const data: OwnerApi[] = await getOwners();
      const mappedOwners = data.map((owner) => ({
        ownerId: owner.ownerId ?? owner.owner_id ?? 0,
        firstName: owner.firstName ?? owner.first_name ?? "",
        lastName: owner.lastName ?? owner.last_name ?? "",
        address: owner.address ?? "",
        email: owner.email ?? "",
        phone: owner.phone ?? "",
      }));

      setOwners(mappedOwners);
      return mappedOwners;
    } catch (err) {
      setError(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadOwners().catch(() => undefined);
  }, [reloadOwners]);

  return {
    owners,
    loading,
    error,
    reloadOwners,
  };
}

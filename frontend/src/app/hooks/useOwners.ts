import { useEffect, useState } from "react";
import type { Owner, OwnerApi } from "../types/Owner";
import { getOwners } from "../types/Owners";

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

 const loadOwners = async () => {
  try {
    const data = await getOwners();

    setOwners(
      data.map((owner: OwnerApi) => ({
        ownerId: owner.owner_id,
        ownerName: owner.owner_name,
        email: owner.email,
        phone: owner.phone,
      }))
    );
  } catch (err) {
    console.error(err);
    setError(true);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const load = async () => {
    await loadOwners();
  };

  void load();
}, []);



 return {
  owners,
  loading,
  error,
  loadOwners,

};
}
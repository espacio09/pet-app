import { useEffect, useState } from "react";
import type { Owner, OwnerApi } from "../types/Owner";
import { getOwners } from "../types/owners";

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);



  useEffect(() => {
    
    async function loadOwners() {
  try {
    console.log("Entrando en loadOwners");

    const data = await getOwners();

    console.log("Owners recibidos:", data);

  const mappedOwners = data.map((owner: OwnerApi) => {
    const ownerId = owner.ownerId ?? owner.owner_id ?? 0;

    return {
      ownerId,
      firstName: owner.firstName ?? owner.first_name ?? "",
      lastName: owner.lastName ?? owner.last_name ?? "",
      email: owner.email ?? "",
      phone: owner.phone ?? "",
    };
  });

    console.log("Mapped owner:", mappedOwners[0]);
    console.log("Total owners:", mappedOwners.length);

    setOwners(mappedOwners);
  } catch (err) {
    console.error("ERROR EN LOADOWNERS:", err);
    setError(true);
  } finally {
    setLoading(false);
  }
}
    
    
    
    
  /*  
    async function loadOwners() {
      try {
        console.log("useOwners arrancó");
        console.log("Entrando en loadOwners");

        const data = await getOwners();

        console.log("Owners recibidos:", data);

        const mappedOwners = data.map((owner: OwnerApi) => ({
          ownerId: owner.owner_id,
          first_name: owner.first_name,
          last_name: owner.last_name,
          email: owner.email,
          phone: owner.phone ?? "",
        }));

        console.log("Mapped owner:", mappedOwners[0]);
        console.log("All mapped owners:", mappedOwners);

        setOwners(mappedOwners);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }*/

    void loadOwners();
  }, []);

  console.log("Owners state:", owners);

return {
  owners,
  loading,
  error,
};

  };

import { useEffect, useState } from "react";
import type { Owner, OwnerApi } from "../types/Owner";
import { getOwners } from "../types/owners";


export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  
useEffect(() => {
  const load = async () => {
    try {

     const data = await getOwners();

console.log("Raw owner:", data[0]);

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
  };

  void load();
}, []);



 return {
  owners,
  loading,
  error,
loadOwners: async () => {
    setLoading(true);
    setError(false);        
},}
}
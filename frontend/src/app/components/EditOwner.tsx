import { useState } from "react";
import { updateOwner } from "../types/owners";

export default function EditOwner() {
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");

  const ownerId = 1;

  const handleSave = async () => {
    try {
      const [firstName = "", ...lastNameParts] = ownerName.trim().split(/\s+/);
      await updateOwner(ownerId, {
        ownerId,
        email,
        address: "",
        phone: "",
        first_name: firstName,
        last_name: lastNameParts.join(" "),
      });
      alert("Owner updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating owner");
    }
  };

  return (
    <div>
      <input
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

import { useState } from "react";
import { updatePet } from "../types/pets";

export default function EditPet() {
  const [petName, setPetName] = useState("");
  const [color, setColor] = useState("");

  const petId = 1;

  const handleSave = async () => {
    try {
      await updatePet(petId, {
        pet_name: petName,
        color,
        sex: "",
        weight: 0,
        birthdate: new Date(),
        ownerId: 0,
        microchip_no: 0,
        pet_typeId: 0,
        breed_id: 0,
      });

      alert("Pet updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating pet");
    }
  };

  return (
    <div>
      <input
        value={petName}
        onChange={(e) => setPetName(e.target.value)}
      />

      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <button onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
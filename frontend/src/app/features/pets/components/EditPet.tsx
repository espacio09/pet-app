import { updatePet } from "../models/pets";

export default function EditPet() {
  const [petName, setPetName] = useState("");
  const [color, setColor] = useState("");

  const petId = 1; // luego vendrá de la URL

  const handleSave = async () => {
    try {
      await updatePet(petId, {
          pet_name: petName,
          color: color,
          sex: "",
          weight: 0,
          birthdate: null,
          ownerId: null,
          microchip_no: null,
          pet_typeId: 0,
          breed_id: null
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